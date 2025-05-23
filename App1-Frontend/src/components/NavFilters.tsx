"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDownAZ, ArrowUpAZ, ArrowDownUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import { useFilter } from "@/context/FilterContext"
import { toast } from "sonner"

export function NavFilters() {
    const minPrice = 0;
    const maxPrice = 3000;
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
    const [minPriceInput, setMinPriceInput] = useState(minPrice.toString())
    const [maxPriceInput, setMaxPriceInput] = useState(maxPrice.toString())
    const {filter, setFilter} = useFilter();

    const handlePriceRangeChange = (values: number[]) => {
        const [min, max] = values as [number, number]
        setPriceRange([min, max])
        setMinPriceInput(min.toString())
        setMaxPriceInput(max.toString())
    }

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setMinPriceInput(value)
        const numValue = Number.parseFloat(value) || 0
        if (numValue <= priceRange[1]) {
            setPriceRange([numValue, priceRange[1]])
        }
    }

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setMaxPriceInput(value)
        const numValue = Number.parseFloat(value) || 0
        if (numValue >= priceRange[0]) {
            setPriceRange([priceRange[0], numValue])
        }
    }

    const handleApplyPriceFilter = () => {
        setFilter({minPrice: priceRange[0], maxPrice: priceRange[1], sortBy: filter?.sortBy})
        toast("Filter applied", {
            description: "Items displayed are priced between $" + priceRange[0].toString() + " and $" + priceRange[1].toString()
        })
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Filters</SidebarGroupLabel>
            <SidebarGroupContent>
                <div className="space-y-4 px-1">
                    <div className="space-y-2">
                        <h4 className="font-medium">Price Range</h4>
                        <Slider
                            defaultValue={[minPrice, maxPrice]}
                            min={0}
                            max={3000}
                            step={1}
                            value={priceRange}
                            onValueChange={handlePriceRangeChange}
                            className="py-4"
                        />
                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-1.5">
                                <Label htmlFor="min-price">Min ($)</Label>
                                <Input
                                    id="min-price"
                                    type="number"
                                    min={0}
                                    value={minPriceInput}
                                    onChange={handleMinPriceChange}
                                    className="h-8"
                                />
                            </div>
                            <div className="grid flex-1 gap-1.5">
                                <Label htmlFor="max-price">Max ($)</Label>
                                <Input
                                    id="max-price"
                                    type="number"
                                    min={0}
                                    value={maxPriceInput}
                                    onChange={handleMaxPriceChange}
                                    className="h-8"
                                />
                            </div>
                        </div>
                        <Button size="sm" className="w-full" onClick={handleApplyPriceFilter}>
                            Apply Filter
                        </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h4 className="font-medium">Sort By</h4>
                        <RadioGroup value={filter?.sortBy} onValueChange={(value) => 
                            setFilter({minPrice: filter?.minPrice, maxPrice: filter?.maxPrice, sortBy: value})}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="priceAsc" id="priceAsc" />
                                <Label htmlFor="priceAsc" className="flex items-center gap-1.5 text-sm">
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                    Price: Low to High
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="priceDesc" id="priceDesc" />
                                <Label htmlFor="priceDesc" className="flex items-center gap-1.5 text-sm">
                                    <ArrowDownUp className="h-3.5 w-3.5" />
                                    Price: High to Low
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nameAsc" id="nameAsc" />
                                <Label htmlFor="nameAsc" className="flex items-center gap-1.5 text-sm">
                                    <ArrowDownAZ className="h-3.5 w-3.5" />
                                    Name: A to Z
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nameDesc" id="nameDesc" />
                                <Label htmlFor="nameDesc" className="flex items-center gap-1.5 text-sm">
                                    <ArrowUpAZ className="h-3.5 w-3.5" />
                                    Name: Z to A
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
