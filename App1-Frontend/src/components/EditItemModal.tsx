import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Item } from "./MainContent"

interface ItemFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (item?: Item) => void
    item: Item | null
    department_id?: number
}

export function EditItemModal({ isOpen, onClose, onSave, item, department_id }: ItemFormModalProps) {
    const [formData, setFormData] = useState<Partial<Item>>(
        item || {
            name: "",
            price: 0,
            imageUrl: "../res/placeholder.svg",
            department_id: department_id,
        }
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || formData.price === undefined) {
            setError("Name and price are required.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const url = item ? "http://localhost:5036/api/Item/UpdateItem" : "http://localhost:5036/api/Item/CreateItem"
            const method = item ? "PUT" : "POST"

            const requestBody: any = {
                name: formData.name,
                price: formData.price,
                imageUrl: formData.imageUrl || "https://g-mdfcdywyfqw.vusercontent.net/placeholder.svg?height=50&width=200",
                department_id: department_id
            };

            if (item) {
                requestBody.id = item.id;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json()
                setError(errorData.message || "Failed to save item.")
                return
            }

            const savedItem = await response.json()
            onSave(savedItem)
            onClose()
        } catch (err) {
            setError("An error occurred while saving the item.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
                        <DialogDescription>
                            {item ? "Make changes to the item details below." : "Fill in the details for the new item."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl || ""}
                                onChange={handleChange}
                                placeholder="https://example-image.png"
                            />
                        </div>
                        {formData.imageUrl && (
                            <div className="mt-2 flex justify-center">
                                <div className="h-32 w-32 overflow-hidden rounded-md border">
                                    <img
                                        src={formData.imageUrl || "/placeholder.svg"}
                                        alt="Item preview"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "../res/placeholder.svg"
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : item ? "Save Changes" : "Add Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
