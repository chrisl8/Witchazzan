// Absolute Unit Circle
// 0 is right
// Except the Y is inverted in screen coordinates from Unit Circle,
// but it still works, so don't ask too many questions.
// cosine is the X component
// sine is the y component
// Also Math.sin and cos require angles in Radians!
// 150 * Math.cos(90 * Math.PI / 180)
// 150 * Math.cos(90 * Math.PI / 180)

function x(velocity, direction) {
  return velocity * Math.cos((direction * Math.PI) / 180);
}

function y(velocity, direction) {
  return velocity * Math.sin((direction * Math.PI) / 180);
}

export default { x, y };
