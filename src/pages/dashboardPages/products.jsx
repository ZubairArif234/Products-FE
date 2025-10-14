import { Button, Table, Checkbox, Drawer, Divider, TextInput, Select, Loader, Pagination, Input, NumberInput, ActionIcon, Badge, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Cloud, CloudHailIcon, LoaderCircle, Minus, Plus, Search, ShoppingCart, Sparkles, SquarePen, Tag, ThumbsUp, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAllProducts, useProducts } from '../../hooks/useProducts';
import { userGetData } from '../../services/hooks';
import { useWarehouse } from '../../hooks/useWarehouse';
import DashboardLogo from "../../assets/logo.png"
import { applyRoiCap, toNum } from '../../utils/helper';
import custAxios from '../../configs/axios.config';

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

  const updateProducts = async () => {
    try{
await custAxios.get("http://localhost:8001/product/update-product")
    }catch(err){
      console.log("err",err)
    }
  }

//   useEffect(()=>{
// updateProducts()
//   },[])
 const location = useLocation();
const { selectedItems = [] } = location.state || {};
   const [filters, setFilters] = useState({
      title: "",
      page: 1,
      limit: "20",
      profitable:true,
      proper:true
    });
      const {products, isPending} = useProducts(filters)
      // const {products:allProduct, isPending:isAllPending} = useAllProducts()
     const [isAllPending , setIsAllPending] = useState(false)
      const { mutateAsync } = useAllProducts();
         
      

    const {warehouse, isPending:isPendingWarehouse} = useWarehouse({})
      const userData = userGetData()
      
      const [opened, { open, close }] = useDisclosure(false);
      const [selectedRows, setSelectedRows] = useState(selectedItems || []);
      const [itemQuantities, setItemQuantities] = useState({});
      const [totalPrice, setTotalPrice] = useState(0);
      const [activePage, setActivePage] = useState(1);



      

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

useEffect(() => {
  // ✅ Ensure all selected items have a quantity in state
 setItemQuantities(prev => {
  const updated = { ...prev };
  selectedRows.forEach(item => {
    if (!updated[item._id]) {
      // ✅ Remove commas and convert to number
      const mqcValue = Number(String(item?.mqc).replace(/,/g, "")) || 1;
      updated[item._id] = mqcValue;
    }
  });
  return updated;
});

  // ✅ Calculate total price
  const total = selectedRows.reduce((sum, item) => {
    if (!item) return sum;
    const quantity = itemQuantities[item._id] || Number(item?.mqc) || 1;
    // const { basePrice } = calculateMetrics(item);
    return sum + item?.price * quantity;
  }, 0);

  setTotalPrice(total);
}, [selectedRows]);


// ✅ Function to update item quantity
const updateQuantity = (itemId, newQuantity) => {
  setItemQuantities(prev => ({
    ...prev,
    [itemId]: newQuantity
  }));
};

// ✅ Function to remove item from cart
const removeFromCart = (itemId) => {
  setSelectedRows(prev => prev.filter(item => item?._id !== itemId));
  setItemQuantities(prev => {
    const newQuantities = { ...prev };
    delete newQuantities[itemId];
    return newQuantities;
  });
};
console.log(itemQuantities);

  const totalQuantity = Object.values(itemQuantities).reduce(
  (sum, qty) => sum + qty,
  0
);


  const rows = products?.products?.map((element, i) => {
   
    // if (element?.profit > 0){

      return (
        <Table.Tr
          key={i}
          className={selectedRows.some((row) => row._id === element._id) ? '!bg-hollywood-700/60 text-white' : undefined}
        >
          <Table.Td>
            <div className='flex items-center gap-2 w-full'>
    
    
           <Checkbox
      color="#154d72"
      aria-label="Select row"
      checked={selectedRows.some((row) => row._id === element._id)} 
      onChange={(event) =>
        setSelectedRows(
          event.currentTarget.checked
            ? [...selectedRows, element] 
            : selectedRows.filter((row) => row._id !== element._id) 
        )
      }
    />
    <div>

            <Badge color="green" w={"80"} > Active</Badge>
            {element?.asin == "B0DZX7D27V" && (
<Tooltip label="Brand Authorization">
                          
              <Badge color="blue" w={"130"} className=' !text-[8px]' > Brand Authorization</Badge>
              </Tooltip>
            )}
    </div>
                </div>
          </Table.Td>
              <Table.Td>
                <div className='flex  rounded-lg p-2 justify-start gap-2 items-center'>
               
               <p className='font-semibold'>
                 {element.brand}
                </p>
    {/* <div className='text-slate-500'>
      <p>Updated</p>
      <p>1/2/2020</p>
    </div> */}
                </div>
                </Table.Td>
          <Table.Td>
            <div className='flex items-center gap-2 capitalize'>
              <img
                className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded'
                src={
                  element?.images?.length > 0
                    ? element?.images[0]
                    : null
                }
                alt={element.name}
              />
              <Link to={`http://amazon.com/dp/${element.asin}`} target='_blank' title={element.name} className='text-md font-semibold line-clamp-3 hover:text-hollywood-600'>
                {element.name}
              </Link>
            </div>
          </Table.Td>
          <Table.Td>${Number(element?.price).toFixed(2)}</Table.Td>
          <Table.Td>{element.mqc}</Table.Td>
          <Table.Td>{element.upc}</Table.Td>
          <Table.Td>{element.asin}</Table.Td>
          <Table.Td>${Number(element?.amazonBb).toFixed(2)}</Table.Td>
          <Table.Td>${Number(element?.amazonFees).toFixed(2)}</Table.Td>
          <Table.Td style={{ color: element?.profit < 0 ? "red" : "green" }}>${Number(element?.profit)?.toFixed(2)}</Table.Td>
          <Table.Td>{Number(element?.margin).toFixed(2)}%</Table.Td>
          <Table.Td>{Number(element?.roi).toFixed(2)}%</Table.Td>
        </Table.Tr>
      );
    // }
});


  const handleSearch =  (value) => {
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

  // Helper to safely quote fields
  const safeValue = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""'); // escape double quotes
    return `"${str}"`; // wrap with quotes
  };

  const rows = data.map((product) => [
    safeValue(product.name || ''),
    safeValue(product.brand || ''),
    safeValue(`$${Number(product.price || 0).toFixed(2)}`),
    safeValue(product.mqc || ''),
    safeValue(product.upc || ''),
    safeValue(product.asin || ''),
    safeValue(`$${Number(product.amazonBb || 0).toFixed(2)}`),
    safeValue(`$${Number(product.amazonFees || 0).toFixed(2)}`),
    safeValue(`$${Number(product.profit || 0).toFixed(2)}`),
    safeValue(`${Number(product.margin || 0).toFixed(2)}%`),
    safeValue(`${Number(product.roi || 0).toFixed(2)}%`),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
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

const handleDownloadSelectedCSV = () => {
  if (selectedRows.length === 0) {
    alert('Please select products to download');
    return;
  }

  // selectedRows already holds full product objects
  const csvContent = convertToCSV(selectedRows);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `selected-products-${timestamp}.csv`;

  downloadCSV(csvContent, filename);
};

// === Function to handle CSV download for all products ===
const handleDownloadAllCSV = async () => {
  try {
    setIsAllPending(true)
    // Fetch all products from the mutation
    const allProducts = await mutateAsync(filters);


    if (!allProducts || allProducts?.products.length === 0) {
      alert("No products available to download");
      return;
    }

    // Convert to CSV
    const csvContent = convertToCSV(allProducts?.products);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `all-products-${timestamp}.csv`;

    // Download file
    downloadCSV(csvContent, filename);
    setIsAllPending(false)
  } catch (error) {
    console.error("Error downloading products:", error);
    setIsAllPending(false)
  }finally{
    setIsAllPending(false)

  }
};

  return (
    <div className="py-5    rounded-lg shadow-md">
      <div className=' bg-gradient-to-r from-hollywood-700 via-hollywood-700 flex flex-wrap justify-between items-center   to-white py-12 px-2 md:px-20'>
      {/* <LoaderCircle size={80}  className='text-white'/> */}
       <div>

        <p className='text-4xl mb-4 capitalize text-white'>Welcome ,<span className='ms-2 '>
           {userData?.name}!
          </span>
           </p>
           <StatsCount productsCount={products?.pagination?.total} warehouseCount={warehouse?.warehouses?.length} />
       </div>
<Link to={"https://launch.apexapplications.io/"} target='_blank'>
       <div className='cursor-pointer flex gap-2 items-end w-[340px]  bg-gradient-to-r from-hollywood-700 to bg-hollywood-800  p-6 rounded-lg '>
<div>

        <span className='bg-white text-hollywood-700 text-sm px-2 py-1  rounded-xl '>Sponsor</span>
        <p className="text-xl font-bold text-white  mt-2">1,200+ Sellers Run on Apex</p>
        <p className='text-white font-semibold '>All your reviews, profits, and restocks in one place.</p>
        <p className="text-sm text-white underline-offset-1 underline ">Get Started →</p>
</div>
        <div>
          <Sparkles size={45} className='text-white'/>
        </div>
       </div>
</Link>
     
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
          color='dark'
          variant="transparent" 
          onClick={handleDownloadSelectedCSV}
          disabled={selectedRows.length === 0} 
          className="!border-1  !border-slate-300 !bg-transparent  !rounded-sm "
          >
         Download CSV
        </Button> 

         <Button 
         disabled={isAllPending}
         loading={isAllPending}
          color='dark'
           variant="transparent"
          onClick={handleDownloadAllCSV}
          className="!border-1  !border-slate-300 !bg-transparent  !rounded-sm "
          >
         Download All
        </Button> 
        </div>
        <div className='flex gap-4 items-center'>

<div className='relative'>
  <ActionIcon className='disabled:!bg-transparent'  onClick={open}
          disabled={selectedRows.length === 0}  variant="white" aria-label="Cart" size={"lg"}>

  <span className=' bg-red-500 flex justify-center items-center w-4 h-4 rounded-full text-white p-2 text-sm absolute right-0 top-0'>{selectedRows.length}</span>
  <ShoppingCart size={40}  className='text-black'/>
  </ActionIcon>
</div>
        {/* <Button 
          variant="ghost" 
          onClick={open}
          disabled={selectedRows.length === 0} 
          className="!bg-hollywood-700 disabled:!bg-hollywood-400 !text-white !rounded-lg !mt-3"
          >
          Add to cart ({selectedRows.length})
        </Button>  */}
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
                <Table.Th>Brand</Table.Th>
                <Table.Th>Name</Table.Th>
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
        <div className='flex justify-end mt-4 flex-wrap'>

{/* <div className='flex items-center gap-2'>
  <Select
  className='w-18'
  rightSection={<ChevronDown size={18} />}
      placeholder="Items per page"
      onChange={handlePageLimit}
      value={filters.limit}
      data={["5","10","15","20"]}

  />
  <p className='text-slate-600 text-sm'>items per page</p>
</div> */}

        <Pagination color='#255b7f' total={products?.pagination?.totalPages}  value={filters.page}
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

      <Drawer   size="lg"
  position="right"
  opened={opened}
  withCloseButton={false}
  onClose={close}
  
 
  >
      <div className="bg-hollywood-400 text-white flex justify-between items-center !w-full px-4 py-2">
      <img
        src={DashboardLogo}
        alt="Default Dashboard Logo"
        className="aspect-auto"
        width={100}
      />
      <p>Create a purchase order</p>
    </div>
        <div className='border-1 border-slate-300'> 

       {selectedRows.length > 0 && selectedRows.map((product,i) => {
  // const product = products?.products?.find(el => el._id === rowId);
  // if (!product) return null;
  
  return (
    <ProductItem 
      key={i} 
      data={{ ...product,  }} 
      quantity={itemQuantities[product?._id] || 1}
      onQuantityChange={(newQuantity) => updateQuantity(product?._id, newQuantity)}
      onRemove={() => removeFromCart(product?._id)}
    />
  );
})}
        
        {selectedRows.length > 0 && (
          <div className="mt-4 pt-4 bg-slate-200 p-2">
            <div className="flex justify-end gap-2 items-center ">
              <p className="text-md ">Total Units</p>
              <p className="text-md ">{totalQuantity}</p>
            </div>
            <div className="flex justify-end gap-2 items-center mb-2">
              <p className="text-lg font-semibold">Total Price:</p>
              <p className="text-xl font-bold ">${totalPrice.toFixed(2)}</p>
            </div>
            <div className='flex justify-end'>

           <Link
  to="/dashboard/checkout"
  state={{
    selectedItems: selectedRows.map(item => ({
      ...item,
      quantity: itemQuantities[item._id] || 1,
    })),
    totalPrice,
  }}
>
  <Button className='!bg-hollywood-700 mt-10 !text-white !rounded-lg w-full'>
    Continue
  </Button>
</Link>
    </div>
          </div>
        )}
        
        {selectedRows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        )}
        </div>
      </Drawer>
    </div>
  );
};

export default Products;

export const ProductItem = ({ data, quantity, onQuantityChange, onRemove }) => {


  const mqcValue = Number(String(data?.mqc).replace(/,/g, "")) || 1;
  return (
    <div className='flex justify-between gap-4 items-start border-b border-gray-300 p-3'>
      <div className='flex gap-3 items-center'>
         <ActionIcon 
            variant="outline" color='gray' aria-label="Remove Item" size={"md"}>

        <Trash 
          size={15} 
          className='text-gray-700 cursor-pointer ' 
          onClick={onRemove}
        />
        </ActionIcon>
        <div className='flex gap-3 items-center w-[95%]'>
          <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
            src={data?.images?.length > 0 ? data?.images[0] : null}
            alt={data.name} 
          />
          <div className='w-[50%]'>
            <p className='text-md font-semibold line-clamp-1' title={data.name}>{data.name}</p>
           <div className='flex mt-1 items-center rounded-lg border border-slate-300'>
<div className='bg-slate-200 py-2.5 px-2 rounded-l-lg'><p className='text-xs'>Quantity</p></div>
            <NumberInput min={mqcValue}   size='sm' className=" !text-end " variant='white' value={quantity} onChange={onQuantityChange}/>
           </div>
       
           
          </div>
        </div>
      </div>
      {/* <div className='flex items-center gap-2 bg-slate-200 p-1 rounded-md'>
        <Minus 
          size={15} 
          onClick={() => quantity > 1 && onQuantityChange(quantity - 1)} 
          className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
        <NumberInput hideControls size='sm' className=" w-16 text-center" value={quantity} onChange={onQuantityChange}/>
       <Plus 
          size={15} 
          onClick={() => onQuantityChange(quantity + 1)} 
          className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
      </div> */}
      <p className="font-semibold text-end">${(Number(data?.price) * quantity).toFixed(2)}</p>
    </div>
  );
};

const StatsCount = ({productsCount,warehouseCount}) => {
  return(
      <div className='grid grid-cols-2 md:grid-cols-6 gap-4 '>
            <div className='rounded-lg  text-white'>
{/* <p className='bg-hollywood-700 text-white p-2 font-semibold rounded-t-lg'>Product</p> */}
<div className='p-2'>

<div className='flex gap-2 items-center justify-start'>
<p className='text-xl font-semibold  text-start'>{productsCount}</p>


</div>
<p className='text-sm font-semibold text-slate-400'>Products Live</p>
</div>
          </div>

           <div className='rounded-lg  text-white'>
{/* <p className='bg-hollywood-700 text-white p-2 font-semibold rounded-t-lg'>Product</p> */}
<div className='p-2'>

<div className='flex gap-2 items-center justify-start'>
<p className='text-xl font-semibold  text-start'>{warehouseCount}</p>


</div>
<p className='text-sm font-semibold text-slate-400'>Warehouse Live</p>
</div>
          </div>
        
        </div>
  )
}