import { useEffect, useState, useMemo } from "react";
import { menuService } from "../services/api";
import { useCart } from "../contexts/CartContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Minus, Plus, Search, Trash2 } from "lucide-react";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await menuService.getCategories();
        setCategories(response.data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await menuService.getAll({
          category: selectedCategory === "all" ? undefined : selectedCategory,
          search: searchTerm || undefined,
        });
        setMenuItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Sort and filter menu items
  const sortedAndFilteredItems = useMemo(() => {
    let items = [...menuItems];

    // Apply sorting
    if (sortBy === "price-low") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [menuItems, sortBy]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center md:justify-between mb-6">
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <label
              htmlFor="category-select"
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
            >
              Category:
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category-select" className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
            >
              Sort by:
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-select" className="w-[180px]">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading menu...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAndFilteredItems.map((item) => {
            const cartItem = cartItems.find(
              (cartEntry) => cartEntry.menuItemId === item._id,
            );

            return (
              <Card key={item._id} className="flex flex-col">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="grid grid-cols-2 gap-4">
                  <p className="text-2xl font-bold text-green-600">
                    ${item.price.toFixed(2)}
                  </p>
                  <div>
                    {!cartItem ? (
                      <Button
                        onClick={() => addToCart(item)}
                        className="w-full"
                        variant="default"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="w-full flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item._id, cartItem.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex-1 text-center font-semibold">
                          {cartItem.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item._id, cartItem.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && sortedAndFilteredItems.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No items match your filter or search.
        </p>
      )}
    </div>
  );
};

export default Menu;
