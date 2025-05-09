import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "./components/ui/table";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Dialog, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";
import { Label } from "./components/ui/label";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Search, PlusCircle, Settings, CircleX } from "lucide-react";

import { generateRandomID } from "./core/Hash";
import { generateUniquePrices } from "./core/Price";
import { getRandomProductName } from "./core/Products";

interface Product {
  id: string;
  produto: string;
  preco: string;
}

function generateRows() {
  const usedIDs = new Set<string>();
  const usedProducts = new Set<string>();
  const uniquePrices = generateUniquePrices(10);

  return Array.from({ length: 10 }).map((_, i) => ({
    id: generateRandomID(usedIDs),
    produto: getRandomProductName(usedProducts),
    preco: `R$ ${uniquePrices[i].toFixed(2).replace(".", ",")}`,
  }));
}

export function App() {
  const [rows, setRows] = useState<Product[]>(() => {
    const saved = localStorage.getItem("tabelaProdutos");
    return saved ? JSON.parse(saved) : [];
  });

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filteredRows, setFilteredRows] = useState<Product[] | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<Product | null>(null); 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 

  useEffect(() => {
    if (!rows) {
      const newRows = generateRows();
      localStorage.setItem("tabelaProdutos", JSON.stringify(newRows));
      setRows(newRows);
      setFilteredRows(newRows);
    } else {
      setFilteredRows(rows);
    }
  }, [rows]);

  if (!rows || !filteredRows) return null;

  function handleNewProductSubmit(e: FormEvent) {
    e.preventDefault();

    const usedIDs = new Set<string>(rows.map((r) => r.id));
    const newProduct = {
      id: generateRandomID(usedIDs),
      produto: newProductName,
      preco: `R$ ${parseFloat(newProductPrice).toFixed(2).replace(".", ",")}`,
    };

    const updatedRows = [...rows, newProduct];
    setRows(updatedRows);
    setFilteredRows(updatedRows);
    localStorage.setItem("tabelaProdutos", JSON.stringify(updatedRows));
    setNewProductName("");
    setNewProductPrice("");
    setIsDialogOpen(false);
  }

  function handleFilterSubmit(e: FormEvent) {
    e.preventDefault();
    const filtered = rows.filter((row) => {
      return filterName
        ? row.produto.toLowerCase().includes(filterName.toLowerCase())
        : true;
    });
    setFilteredRows(filtered);
  }

  function handleDeleteProduct() {
    if (!productToDelete) return;

   
    const updatedRows = rows.filter((r) => r.id !== productToDelete.id);
    setRows(updatedRows);
    setFilteredRows(updatedRows);
    localStorage.setItem("tabelaProdutos", JSON.stringify(updatedRows));

    
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Produtos</h1>
      <div className="flex itens-center justify-between">
        <form className="flex itens-center gap-2" onSubmit={handleFilterSubmit}>
          <Input
            name="name"
            placeholder="Nome do produto"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <Button type="submit" variant="link">
            <Search className="w-4 h-4 mr-2" />
            Filtrar resultados
          </Button>
        </form>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo produto
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
              <DialogDescription>
                Criar um novo produto no sistema
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-6" onSubmit={handleNewProductSubmit}>
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label htmlFor="name">Produto</Label>
                <Input
                  className="col-span-3"
                  id="name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label htmlFor="price">Preço</Label>
                <Input
                  className="col-span-3"
                  id="price"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg p-2">
        <Table>
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Editar</TableHead>
            <TableHead>Deletar</TableHead>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.produto}</TableCell>
                <TableCell>{row.preco}</TableCell>
                <TableCell className="pr-0">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(row);
                          setNewProductName(row.produto);
                          const precoNumerico = parseFloat(row.preco.replace("R$ ", "").replace(",", "."));
                          setNewProductPrice(precoNumerico.toString());
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="box-content w-120">
                      <DialogHeader>
                        <DialogTitle>Editar produto</DialogTitle>
                        <DialogDescription>
                          Você está editando as configurações do produto: {row.produto}
                        </DialogDescription>
                      </DialogHeader>

                      <form
                        className="space-y-6"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!editingProduct) return;

                          const updatedRows = rows.map((r) =>
                            r.id === editingProduct.id
                              ? {
                                  ...r,
                                  produto: newProductName,
                                  preco: `R$ ${parseFloat(newProductPrice)
                                    .toFixed(2)
                                    .replace(".", ",")}`,
                                }
                              : r
                          );

                          setRows(updatedRows);
                          setFilteredRows(updatedRows);
                          localStorage.setItem("tabelaProdutos", JSON.stringify(updatedRows));

                          setEditingProduct(null);
                          setNewProductName("");
                          setNewProductPrice("");
                          setIsEditDialogOpen(false);
                        }}
                      >
                        <div className="grid grid-cols-4 items-center text-right gap-3">
                          <Label htmlFor="edit-name">Nome</Label>
                          <Input
                            className="col-span-3"
                            id="edit-name"
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center text-right gap-3">
                          <Label htmlFor="edit-price">Preço</Label>
                          <Input
                            className="col-span-3"
                            id="edit-price"
                            value={newProductPrice}
                            onChange={(e) => setNewProductPrice(e.target.value)}
                            type="number"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button type="submit">Salvar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setProductToDelete(row); 
                          setIsDeleteDialogOpen(true); 
                        }}
                      >
                        <CircleX />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="box-content w-140">
                      <DialogHeader>
                        <DialogTitle>Deletar produto</DialogTitle>
                        <DialogDescription>
                          Você está prestes a deletar o produto: {row.produto}. Tem certeza?
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleDeleteProduct} 
                        >
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
