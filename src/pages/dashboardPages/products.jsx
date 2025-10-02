import { Button, Table, Checkbox, Drawer, Divider, TextInput, Select, Loader, Pagination, Input, NumberInput, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, LoaderCircle, Minus, Plus, Search, ShoppingCart, SquarePen, Tag, ThumbsUp, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { userGetData } from '../../services/hooks';
import { useWarehouse } from '../../hooks/useWarehouse';

export const calculateMetrics = (product) => {
    console.log(product , "products in calculate");
    
  let basePrice = Number(
       product.price.split("$")[1]
     
  ) || 0;

  let amazonBb = Number(product.amazonBb) || 0;
  let amazonFees = Number(product.amazonFees) || 0;

  // initial profit, margin, roi
  let profit = amazonBb - (basePrice + amazonFees);
  let margin = (profit / amazonBb) * 100;
  let roi = (profit / basePrice) * 100;

  // cap ROI at 40%
  if (roi > 40) {
    const exceedingPercent = roi - 40;
    basePrice = basePrice * (1 + exceedingPercent / 100); // increase price
    profit = amazonBb - (basePrice + amazonFees); // recalc profit
    margin = ((profit / amazonBb) * 100);
    roi = ((profit / basePrice) * 100);
  }

  return { basePrice, profit, margin, roi };
};

const Products = () => {
   const [filters, setFilters] = useState({
      title: "",
      page: 1,
      limit: "5",
    });
      const {products, isPending} = useProducts(filters)
      
    const {warehouse, isPending:isPendingWarehouse} = useWarehouse({})
      const userData = userGetData()
      
      const [opened, { open, close }] = useDisclosure(false);
      const [selectedRows, setSelectedRows] = useState([]);
      const [itemQuantities, setItemQuantities] = useState({});
      const [totalPrice, setTotalPrice] = useState(0);
      const [activePage, setActivePage] = useState(1);
      console.log(activePage,"activePage");

  const elements = [
  {
    id: 1,
    name: "Black Jacket",
    description: "A warm black jacket",
    brand: "Brand A",
    createdAt: "2023-01-01",
    price: 100,
    moq: 10,
    upc: "123456789012",
    asin: "B00ABC1234",
    amazonBB: "19.6",
    amazonFees: 15,
    profit: 25,
    margin: "20%",
    roi: "25%"
  },
  {
    id: 2,
    name: "White Shirt",
    description: "A plain white shirt",
    brand: "Brand B",
    createdAt: "2023-01-02",
    price: 200,
    moq: 20,
    upc: "223456789012",
    asin: "B00DEF5678",
    amazonBB: "17.0",
    amazonFees: 30,
    profit: 50,
    margin: "25%",
    roi: "30%"
  },
  {
    id: 3,
    name: "Blue Jeans",
    description: "Comfortable blue jeans",
    brand: "Brand C",
    createdAt: "2023-01-03",
    price: 260,
    moq: 15,
    upc: "323456789012",
    asin: "B00GHI9012",
    amazonBB: "23.9",
    amazonFees: 40,
    profit: 60,
    margin: "23%",
    roi: "28%"
  },
  {
    id: 4,
    name: "Red Dress",
    description: "Elegant red dress",
    brand: "Brand D",
    createdAt: "2023-01-04",
    price: 300,
    moq: 12,
    upc: "423456789012",
    asin: "B00JKL3456",
    amazonBB: "14.0",
    amazonFees: 50,
    profit: 70,
    margin: "24%",
    roi: "27%"
  },
  {
    id: 5,
    name: "Green Sweater",
    description: "Cozy green sweater",
    brand: "Brand E",
    createdAt: "2023-01-05",
    price: 150,
    moq: 8,
    upc: "523456789012",
    asin: "B00MNO7890",
    amazonBB: "10.0",
    amazonFees: 20,
    profit: 30,
    margin: "20%",
    roi: "22%"
  }
];

  // Calculate total price whenever itemQuantities changes
  useEffect(() => {
    const total = selectedRows.reduce((sum, rowId) => {
      const item = products?.products?.find(el => el._id === rowId);
      const quantity = itemQuantities[rowId] || 1;
    if (!item) return sum;
const { basePrice } = calculateMetrics(item);
return sum + basePrice * quantity;
    }, 0);
    setTotalPrice(total);
  }, [selectedRows, itemQuantities]);

  // Function to update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  // Function to remove item from cart
  const removeFromCart = (itemId) => {
    setSelectedRows(prev => prev.filter(id => id !== itemId));
    setItemQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });
  };

  


  const rows = products?.products?.map((element, i) => {
  let basePrice = Number(element.price?.split("$")[1]) || 0;
  let amazonBb = Number(element.amazonBb) || 0;
  let amazonFees = Number(element.amazonFees) || 0;

  // initial profit, margin, roi
  let profit = amazonBb - (basePrice + amazonFees);
  let margin = amazonBb > 0 ? ((profit / amazonBb) * 100) : 0;
  let roi = basePrice > 0 ? ((profit / basePrice) * 100) : 0;

  // check ROI cap
  if (roi > 40) {
    const exceedingPercent = roi - 40;
    basePrice = basePrice * (1 + exceedingPercent / 100); // increase price
    profit = amazonBb - (basePrice + amazonFees); // recalc profit
    margin = amazonBb > 0 ? ((profit / amazonBb) * 100) : 0;
    roi = basePrice > 0 ? ((profit / basePrice) * 100) : 0;
  }

  return (
    <Table.Tr
      key={i}
      className={selectedRows.includes(element._id) ? '!bg-hollywood-700/80 text-white' : undefined}
    >
      <Table.Td>
        <Checkbox
          color='#154d72'
          aria-label="Select row"
          checked={selectedRows.includes(element._id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element._id]
                : selectedRows.filter((id) => id !== element._id)
            )
          }
        />
      </Table.Td>
      <Table.Td>
        <div className='flex items-center gap-2 capitalize'>
          <img
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded'
            src={
              element?.images?.length > 0
                ? element?.images[0]
                : "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"
            }
            alt={element.name}
          />
          <Link to={`http://amazon.com/dp/${element.asin}`} target='_blank' title={element.name} className='text-md font-semibold line-clamp-2 hover:text-hollywood-600'>
            {element.name}
          </Link>
        </div>
      </Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>${basePrice.toFixed(2)}</Table.Td>
      <Table.Td>{element.mqc}</Table.Td>
      <Table.Td>{element.upc}</Table.Td>
      <Table.Td>{element.asin}</Table.Td>
      <Table.Td>${amazonBb.toFixed(2)}</Table.Td>
      <Table.Td>${amazonFees.toFixed(2)}</Table.Td>
      <Table.Td style={{ color: profit < 0 ? "red" : "green" }}>${profit.toFixed(2)}</Table.Td>
      <Table.Td>{margin.toFixed(2)}%</Table.Td>
      <Table.Td>{roi.toFixed(2)}%</Table.Td>
    </Table.Tr>
  );
});


  const handleSearch = (value) => {
  setFilters((prev) => ({
    ...prev,
    title: value,   // update title
    page: 1         // reset page to 1 when searching
  }));
};

const handleWarehouse = (value) => {
  setFilters((prev) => ({
    ...prev,
    warehouse: value,
    page: 1,
  }));
};
const handleBrand = (value) => {
  setFilters((prev) => ({
    ...prev,
    brand: value,
    page: 1,
  }));
};
const handlePageLimit = (value) => {
  setFilters((prev) => ({
    ...prev,
    limit: value,
    page: 1,
  }));
};


const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = [
    'Product Name',
    'Brand', 
    'Price',
    'MOQ',
    'UPC',
    'ASIN',
    'Amazon BB',
    'Amazon Fees',
    'Profit',
    'Margin',
    'ROI',
  ];
  
  const csvContent = [
    headers.join(','), 
    ...data.map(product => {
      const { basePrice, profit, margin, roi } = calculateMetrics(product);

      return [
        `"${product.name || ''}"`,
        `"${product.brand || ''}"`,
        `"$${basePrice.toFixed(2)}"`,
        `"${product.mqc || ''}"`,
        `"${product.upc || ''}"`,
        `"${product.asin || ''}"`,
        `"$${Number(product.amazonBb || 0).toFixed(2)}"`,
        `"$${Number(product.amazonFees || 0).toFixed(2)}"`,
        `"$${profit.toFixed(2)}"`,
        `"${margin.toFixed(2)}%"`,
        `"${roi.toFixed(2)}%"`,
      ].join(',');
    })
  ].join('\n');
  
  return csvContent;
};


// Function to download CSV file
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Function to handle CSV download for selected products
const handleDownloadSelectedCSV = () => {
  if (selectedRows.length === 0) {
    // Show notification that no products are selected
    alert('Please select products to download');
    return;
  }
  
  // Get selected products data
  const selectedProducts = products?.products?.filter(product => 
    selectedRows.includes(product._id)
  );
  
  const csvContent = convertToCSV(selectedProducts);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `selected-products-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
};

// Function to handle CSV download for all products
const handleDownloadAllCSV = () => {
  if (!products?.products || products.products.length === 0) {
    alert('No products available to download');
    return;
  }
  
  const csvContent = convertToCSV(products.products);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `all-products-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
};
  return (
    <div className="py-5    rounded-lg shadow-md">
      <div className=' bg-gradient-to-r from-hollywood-700 via-hollywood-700  to-white py-12 px-20'>
      {/* <LoaderCircle size={80}  className='text-white'/> */}
       <div>

        <p className='text-3xl mb-4 capitalize text-white'>Welcome ,<span className='ms-2 '>
           {userData?.name}!
          </span>
           </p>
           <StatsCount productsCount={products?.pagination?.total} warehouseCount={warehouse?.warehouses?.length} />
       </div>
     
      </div>
      <Divider my={20}/>
      <div className='bg-white p-2 rounded-lg shadow-lg'>

        <div className=''>
          {/* <p className="font-bold text-hollywood-700 text-lg">Products</p> */}
          {/* <p className="text-sm text-gray-500">There are {elements.length} products</p> */}
        </div>
      <div className='flex justify-between items-center flex-wrap'>
        <div className='flex gap-4 items-center'>
          <TextInput placeholder='Search Product' value={filters.title}
  onChange={(e) => handleSearch(e.target.value)} leftSection={<Search size={18}  />}/>
          <TextInput placeholder='Search Brand' value={filters.brand}
  onChange={(e) => handleBrand(e.target.value)} leftSection={<Tag  size={18}  />}/>
        
         <Select
    rightSection={<ChevronDown size={18} />}
      placeholder="Filter by warehouse"
      clearable
      searchable
      value={filters.warehouse}
      onChange={handleWarehouse}
      data={warehouse?.warehouses?.map((element)=>{return({
        label:element.name,
        value:element._id
      })})} />
          <Button 
          variant="transparent" 
          onClick={handleDownloadSelectedCSV}
          disabled={selectedRows.length === 0} 
          className="!border-1 !border-slate-300 !bg-transparent  !rounded-sm "
          >
         Download CSV
        </Button> 
        </div>
        <div className='flex gap-4 items-center'>

<div className='relative'>
  <ActionIcon variant="white" aria-label="Cart" >

  <span className='!z-20 bg-red-500 flex justify-center items-center w-4 h-4 rounded-full text-white p-2 text-sm absolute -right-1 -top-1'>{selectedRows.length}</span>
  <ShoppingCart size={30}  className='text-black'/>
  </ActionIcon>
</div>
        <Button 
          variant="ghost" 
          onClick={open}
          disabled={selectedRows.length === 0} 
          className="!bg-hollywood-700 disabled:!bg-hollywood-400 !text-white !rounded-lg !mt-3"
          >
          Add to cart ({selectedRows.length})
        </Button> 
        {/* <Button 
          variant="default" 
          onClick={handleDownloadSelectedCSV}
          disabled={selectedRows.length === 0} 
          className="!bg-hollywood-700 disabled:!bg-hollywood-400 !text-white !rounded-lg !mt-3"
          >
         Download CSV
        </Button>  */}
            </div>
      </div>

      

 <div className='capitalize'>
        {isPending  ? 
        <div className='my-20 flex justify-center'>

            <Loader color="#255b7f" />
        </div>
         :
         products?.products?.length > 0  ?
         <div>

        <Table.ScrollContainer minWidth={500} type="native">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th />
                <Table.Th>Product Name</Table.Th>
                <Table.Th>Brand</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>MOQ</Table.Th>
                <Table.Th>UPC</Table.Th>
                <Table.Th>ASIN</Table.Th>
                <Table.Th>Amazon BB</Table.Th>
                <Table.Th>Amazon Fees</Table.Th>
                <Table.Th>Profit</Table.Th>
                <Table.Th>Margin</Table.Th>
                <Table.Th>ROI</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <div className='flex justify-between mt-4 flex-wrap'>

<div className='flex items-center gap-2'>
  <Select
  className='w-18'
  rightSection={<ChevronDown size={18} />}
      placeholder="Items per page"
      onChange={handlePageLimit}
      value={filters.limit}
      data={["5","10","15","20"]}

  />
  <p className='text-slate-600 text-sm'>items per page</p>
</div>

        <Pagination color='#255b7f' total={products?.pagination?.totalPages/filters.limit}  value={filters.page}
  onChange={(page) => setFilters((prev) => ({ ...prev, page }))}  mt="sm" />
        </div>
         </div>
        :
        <div className='my-20 flex flex-col justify-center items-center'>
<p className='text-xl font-semibold'>No Products Found</p>
<p className='text-sm text-slate-400'>There are no product based on the search</p>
        </div>
        }
      </div>

      </div>

      <Drawer size={"lg"} position="right" opened={opened} onClose={close} title="Shopping Cart">
       {selectedRows.length > 0 && selectedRows.map((rowId) => {
  const product = products?.products?.find(el => el._id === rowId);
  if (!product) return null;
  
  const { basePrice, profit, margin, roi } = calculateMetrics(product);

  return (
    <ProductItem 
      key={rowId} 
      data={{ ...product, basePrice, profit, margin, roi }} 
      quantity={itemQuantities[rowId] || 1}
      onQuantityChange={(newQuantity) => updateQuantity(rowId, newQuantity)}
      onRemove={() => removeFromCart(rowId)}
    />
  );
})}
        
        {selectedRows.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Total Price:</p>
              <p className="text-lg font-bold text-hollywood-700">${totalPrice}</p>
            </div>
            <Link to="/dashboard/checkout"   state={{
    selectedItems: selectedRows.map((rowId) => ({
      ...products?.products?.find((el) => el._id === rowId),
      quantity: itemQuantities[rowId] || 1,
    })),
    totalPrice,
  }}>
            <Button className='!bg-hollywood-700 !text-white !rounded-lg w-full'>
              Checkout (${totalPrice})
            </Button>
            </Link>
          </div>
        )}
        
        {selectedRows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Products;

export const ProductItem = ({ data, quantity, onQuantityChange, onRemove }) => {
 console.log(data , "data");
 const price = data?.price?.split("$")[1]
 console.log(price , "price");
 
  return (
    <div className='flex justify-between gap-4 items-center border-b border-gray-300 p-3'>
      <div className='flex gap-3 items-center'>
        <Trash 
          size={15} 
          className='text-red-500 cursor-pointer hover:text-red-700' 
          onClick={onRemove}
        />
        <div className='flex gap-3 items-center w-[95%]'>
          <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
            src={data?.images?.length > 0 ? data?.images[0] : "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
            alt={data.name} 
          />
          <div>
            <p className='text-md font-semibold line-clamp-1' title={data.name}>{data.name}</p>
            <p className='text-sm text-gray-500'>{data.brand}</p>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-slate-200 p-1 rounded-md'>
        <Minus 
          size={15} 
          onClick={() => quantity > 1 && onQuantityChange(quantity - 1)} 
          className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
        <NumberInput hideControls size='sm' className=" w-16 text-center" value={quantity} onChange={onQuantityChange}/>
        {/* <p className="min-w-[20px] text-center">{quantity}</p> */}
        <Plus 
          size={15} 
          onClick={() => onQuantityChange(quantity + 1)} 
          className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
      </div>
      <p className="font-semibold w-14">${(Number(data?.basePrice) * quantity).toFixed(2)}</p>
    </div>
  );
};

const StatsCount = ({productsCount,warehouseCount}) => {
  return(
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4 '>
            <div className='rounded-lg  text-white'>
{/* <p className='bg-hollywood-700 text-white p-2 font-semibold rounded-t-lg'>Product</p> */}
<div className='p-2'>

<div className='flex gap-2 items-center justify-center'>
<p className='text-xl font-semibold  text-center'>{productsCount}</p>
<div className='flex items-center gap-1 bg-green-200 text-xs text-green-700 p-1 rounded-lg'>
  <ThumbsUp size={18}/>
  100%
</div>

</div>
<p className='text-sm font-semibold text-slate-400 text-center'>Products Live</p>
</div>
          </div>

           <div className='rounded-lg  text-white'>
{/* <p className='bg-hollywood-700 text-white p-2 font-semibold rounded-t-lg'>Product</p> */}
<div className='p-2'>

<div className='flex gap-2 items-center justify-center'>
<p className='text-xl font-semibold  text-center'>{warehouseCount}</p>
<div className='flex items-center gap-1 bg-green-200 text-xs text-green-700 p-1 rounded-lg'>
  <ThumbsUp size={18}/>
  100%
</div>

</div>
<p className='text-sm font-semibold text-slate-400 text-center'>Warehouse Live</p>
</div>
          </div>
        
        </div>
  )
}