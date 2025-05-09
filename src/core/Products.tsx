const produtosEletro = [
  "Geladeira",
  "Fogão 4 bocas",
  "Micro-ondas",
  "Liquidificador",
  "Cafeteira elétrica",
  "Aspirador de pó",
  "Máquina de lavar",
  "Ventilador",
  "Ar-condicionado",
  "Sanduicheira"
];

export function getRandomProductName(used: Set<string>) {
  const available = produtosEletro.filter(p => !used.has(p));
  const product = available[Math.floor(Math.random() * available.length)];
  used.add(product);
  return product;
}