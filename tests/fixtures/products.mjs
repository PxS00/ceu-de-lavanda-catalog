// Synthetic inventory belongs only to automated tests.
export const syntheticProducts = Array.from({ length: 101 }, (_, index) => ({
  id: `synthetic-${index}`,
  slug: `synthetic-${index}`,
  name: `${["Água de Rosas", "Brisa de Verão", "Céu de Açúcar"][index % 3]} ${String(index + 1).padStart(3, "0")}`,
  category: index < 90 ? "perfumes" : index < 100 ? "body-splash" : "perfume-capilar",
  ...(index === 0 ? { photo: { src: "/products/motion-test.png", alt: "Fotografia de teste" } } : {}),
}));
