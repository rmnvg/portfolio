const COLORS = ["#8b7bff", "#4fd1c5", "#ffffff"];

export function burstConfetti(x: number, y: number) {
  const count = 22;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const size = 4 + Math.random() * 4;
    el.style.position = "fixed";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.pointerEvents = "none";
    el.style.zIndex = "300";
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;

    const animation = el.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.4)`, opacity: 0 },
      ],
      {
        duration: 700 + Math.random() * 400,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );
    animation.onfinish = () => el.remove();
  }
}
