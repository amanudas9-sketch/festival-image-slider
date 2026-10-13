/**
 * Gallery - infinite-loop slider (no libraries)
 *
 * How the loop works (no cloned slides):
 *  - Moving FORWARD by n: animate the track left by n slides, then, once
 *    the animation is over, move the first n slides to the END of the list
 *    and reset the track to 0 with the transition turned off.
 *  - Moving BACKWARD by n: first move the last n slides to the FRONT and
 *    shift the track left by n slides (no transition, invisible), then
 *    animate it back to 0.
 *  Either way the visitor sees one continuous slide, and the track always
 *  rests at translateX(0).
 *
 * Features: arrows, clickable dots, counter, autoplay + pause button,
 * keyboard arrows, touch/mouse swipe, pause on hover.
 */
class Gallery {
  constructor(root, { delay = 4500, speed = 600 } = {}) {
    this.root = root;
    this.win = root.querySelector('.gallery__window');
    this.track = root.querySelector('.gallery__track');
    this.pager = root.querySelector('.pager');
    this.counter = root.querySelector('.counter');
    this.toggleBtn = root.querySelector('.toggle');

    this.total = this.track.children.length;
    this.current = 0;          // index of the slide on screen, in original order
    this.busy = false;
    this.delay = delay;
    this.speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : speed;
    this.playing = delay > 0;
    this.timer = null;

    // remember each slide's original position so dots stay correct after reordering
    [...this.track.children].forEach((li, i) => (li.dataset.pos = i));

    this.buildDots();
    this.bind();
    this.render();
    if (this.playing) this.play();
  }

  /* ---------- setup ---------- */
  buildDots() {
    this.dots = [...this.track.children].map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pager__dot';
      b.setAttribute('aria-label', `Show slide ${i + 1}`);
      b.addEventListener('click', () => this.goTo(i));
      this.pager.appendChild(b);
      return b;
    });
  }

  bind() {
    this.root.querySelector('.nav--next').addEventListener('click', () => this.move(1));
    this.root.querySelector('.nav--prev').addEventListener('click', () => this.move(-1));

    this.toggleBtn.addEventListener('click', () => (this.playing ? this.stop(true) : this.play(true)));

    this.root.addEventListener('mouseenter', () => this.clearTimer());
    this.root.addEventListener('mouseleave', () => this.playing && this.schedule());

    this.root.tabIndex = 0;
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.move(1);
      if (e.key === 'ArrowLeft') this.move(-1);
    });

    // swipe (touch and mouse)
    let x0 = null;
    this.win.addEventListener('pointerdown', (e) => (x0 = e.clientX));
    window.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) this.move(dx < 0 ? 1 : -1);
    });
  }

  /* ---------- movement ---------- */
  move(steps) {
    if (this.busy || steps === 0) return;
    this.busy = true;
    const n = Math.abs(steps);
    const t = `transform ${this.speed}ms cubic-bezier(.77,0,.18,1)`;

    if (steps > 0) {
      this.track.style.transition = t;
      this.track.style.transform = `translateX(${-100 * n}%)`;
      this.afterAnimation(() => {
        for (let i = 0; i < n; i++) this.track.appendChild(this.track.firstElementChild);
        this.reset();
      });
    } else {
      for (let i = 0; i < n; i++) this.track.insertBefore(this.track.lastElementChild, this.track.firstElementChild);
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(${-100 * n}%)`;
      void this.track.offsetWidth;                 // force reflow so the jump is applied first
      this.track.style.transition = t;
      this.track.style.transform = 'translateX(0)';
      this.afterAnimation(() => this.reset());
    }

    this.current = (this.current + steps + this.total * n) % this.total;
    this.render();
    if (this.playing) this.schedule();
  }

  /** Dot click: take the shortest direction to the chosen slide */
  goTo(index) {
    let diff = index - this.current;
    if (diff === 0) return;
    if (Math.abs(diff) > this.total / 2) diff += diff > 0 ? -this.total : this.total;
    this.move(diff);
  }

  afterAnimation(fn) {
    setTimeout(fn, this.speed + 30);
  }

  reset() {
    this.track.style.transition = 'none';
    this.track.style.transform = 'translateX(0)';
    this.busy = false;
  }

  render() {
    this.dots.forEach((d, i) => d.classList.toggle('is-on', i === this.current));
    this.counter.textContent = `${this.current + 1} / ${this.total}`;
  }

  /* ---------- autoplay ---------- */
  schedule() {
    this.clearTimer();
    this.timer = setTimeout(() => this.move(1), this.delay);
  }

  clearTimer() {
    clearTimeout(this.timer);
  }

  play() {
    this.playing = true;
    this.toggleBtn.textContent = 'Pause';
    this.toggleBtn.setAttribute('aria-label', 'Pause autoplay');
    this.schedule();
  }

  stop() {
    this.playing = false;
    this.clearTimer();
    this.toggleBtn.textContent = 'Play';
    this.toggleBtn.setAttribute('aria-label', 'Start autoplay');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery').forEach((el) => new Gallery(el, { delay: 4500, speed: 600 }));
});
