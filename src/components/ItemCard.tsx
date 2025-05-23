import { useState } from "react";
import { Button } from "./ui/button";
import { ShoppingCart, Edit, Trash } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { EditItemModal } from "./EditItemModal";
import type { Item } from "./MainContent";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";

interface ItemCardProps {
    item: Item;
    updateItemsAfterEdit: () => void;
    fetchCartItems: () => void;
}

export function ItemCard({ item, updateItemsAfterEdit, fetchCartItems }: ItemCardProps) {
    const { user } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const confirmDeleteItem = async () => {
        try {
            await axios.delete(`http://localhost:5036/api/Item/DeleteItem/${item.id}`);
            updateItemsAfterEdit();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete the item.");
        }
    }

    const addTocart = async () => {
        await axios.post(`http://localhost:5036/api/Cart/${user?.cartId}/add-item`, null, {
            params: {
                itemId: item.id,
                quantity: 1,
            },
        });
        fetchCartItems();
        toast("Item added to cart", {
            description: item.name,
            action: {
                label: "Undo",
                onClick: undoAddItemToCart,
            },
        })
    }

    const undoAddItemToCart = async () => {
        await axios.post(`http://localhost:5036/api/Cart/${user?.cartId}/add-item`, null, {
            params: {
                itemId: item.id,
                quantity: -1,
            },
        });
        fetchCartItems();
    };

    return (
        <div className="group overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square w-full overflow-hidden">
                <img
                    src={item.imageUrl || "../res/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-green-800">${item.price.toFixed(2)}</p>
                    {user?.isAdmin ? (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 rounded-full p-0"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit item</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 rounded-full p-0 text-destructive hover:bg-destructive/10"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete item</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0"
                            onClick={addTocart}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="sr-only">Add to cart</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Edit Item Modal */}
            <EditItemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={() => {
                    setIsEditModalOpen(false);
                    updateItemsAfterEdit();
                }}
                item={item}
                department_id={item.department_id}
            />
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-600 text-white hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}