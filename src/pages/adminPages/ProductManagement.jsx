import { Button, Table, Checkbox,Drawer, Divider, TextInput, Select,Modal, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, FileAxis3d, Minus, Plus, Upload, CheckCircle2, X, Search, SquarePen, Trash } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

const ProductManagement = () => {
     const [filters, setFilters] = useState({
    title: "",
    page: 1,
    limit: 6,
  });
    const {products, isPending} = useProducts(filters)
   
    
  const [opened, { open, close }] = useDisclosure(false);
  const [openedUpload, { open:openUpload, close:closeUpload }] = useDisclosure(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

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
      const item = elements.find(el => el.id === rowId);
      const quantity = itemQuantities[rowId] || 1;
      return sum + (item.price * quantity);
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

  const rows = products?.map((element, i) => (
    <Table.Tr key={i} className={selectedRows.includes(element.id) ? '!bg-hollywood-700/80 text-white' : undefined}>
      {/* <Table.Td>
        <Checkbox
          color='#154d72'
          aria-label="Select row"
          checked={selectedRows.includes(element.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.id]
                : selectedRows.filter((id) => id !== element.id)
            )
          }
        />
      </Table.Td> */}
      <Table.Td>
        <div className='flex items-center gap-2'>
           <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
           src={"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
            alt={element.name} 
          />
          {element.name}
          </div>
          </Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>{element.price}</Table.Td>
      <Table.Td>{element.mqc}</Table.Td>
      <Table.Td>{element.upc}</Table.Td>
      <Table.Td>{element.asin}</Table.Td>
      <Table.Td>${element.amazonBb}</Table.Td>
      <Table.Td>${element.amazonFees}</Table.Td>
      <Table.Td>${element.profit}</Table.Td>
      <Table.Td>{element.margin}</Table.Td>
      <Table.Td>{element.roi}</Table.Td>
    </Table.Tr>
  ));

 const handleSearch = (value) => {
  setFilters((prev) => ({
    ...prev,
    title: value,   // update title
    page: 1         // reset page to 1 when searching
  }));
};

//   const productData =aync () => {
//     const apiKeyId = "8c7b051f-b0ad-4e70-9280-652f4b09c721";
//   const apiKeySecret = "eba2d5e86af48563553159bdb996a55439719c243b3325cab30c9aee467866ccb976b0807a98d44421389fddae7ca5aeff136c0a4154a290c3370e3cf9fe2d4c";

//   const signPayload = `${Date.now()}${Math.random()}`; // doesn't really matter what's here

//   const signature = createHmac("sha256", apiKeySecret).update(signPayload).digest("hex");

//   const headers = {
//     "x-api-key-id": apiKeyId,
//     "x-api-sign-input": signPayload,
//     "x-api-signature": signature,
//   };

//   const asins = await axios.post(`https://app.apexapplications.com/api/data/get-asins-info`, {
//     asins: ["B074ZH8Y6D", "B07Q4VPRM5", "B0088K9L9U"],
//   }, {headers}).then((r) => r.data);
//   }
//   useEffect(()=>{

//   },[])
  return (
    <div className="py-5 px-20  rounded-lg shadow-md">
      <div>
        <p className='text-3xl mb-4'>Welcome ,<span className='ms-2 text-hollywood-700 font-bold'>
           John Doe
          </span>
           </p>
      <StatsCount/>
      </div>
      <Divider my={20}/>
      <div className='bg-white p-2 rounded-lg shadow-lg'>

        <div className=''>
          <p className="font-bold text-hollywood-700 text-lg">Products</p>
          {/* <p className="text-sm text-gray-500">There are {elements.length} products</p> */}
        </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <TextInput placeholder='Search Product' value={filters.title}
  onChange={(e) => handleSearch(e.target.value)} leftSection={<Search size={18}  />}/>
          {/* <Select
    rightSection={<ChevronDown size={18} />}
      placeholder="Filter by brand"
      clearable
      searchable
      data={['Brand A', 'Brand B', 'Brand C', 'Brand D' , 'Brand E']}
    />
          <Select
    rightSection={<ChevronDown size={18} />}
      placeholder="Filter by warehouse"
      clearable
      searchable
      data={['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D' , 'Warehouse E']}
    /> */}
        </div>
        <div className='flex gap-4 items-center'>

        {/* <Button 
          variant="default" 
          onClick={open}
          disabled={selectedRows.length === 0} 
          className="!bg-hollywood-700 disabled:!bg-hollywood-400 !text-white !rounded-lg !mt-3"
          >
          Add to cart ({selectedRows.length})
        </Button>  */}
        <Button 
          variant="default" 
          onClick={open}
          // disabled={selectedRows.length === 0} 
          className="!bg-hollywood-700 disabled:!bg-purple-300 !text-white !rounded-lg !mt-3"
          >
         Upload CSV
        </Button> 
            </div>
      </div>

      <div className='capitalize'>
        {isPending  ? 
        <div className='my-20 flex justify-center'>

            <Loader color="#255b7f" />
        </div>
         :
         products?.length > 0  ?
        <Table.ScrollContainer  minWidth={500} type="native">
          <Table>
            <Table.Thead>
              <Table.Tr>
                {/* <Table.Th /> */}
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
        </Table.ScrollContainer>:
        <div className='my-20 flex flex-col justify-center items-center'>
<p className='text-xl font-semibold'>No Products Found</p>
<p className='text-sm text-slate-400'>There are no product based on the search</p>
        </div>
        }
      </div>

      </div>

  <Modal opened={opened} onClose={close} centered title="Upload CSV">
      <div>
      <div className=''>
        {/* <p className='text-md font-semibold'>Select Warehouse</p> */}
         <Select
    rightSection={<ChevronDown size={18} />}
      placeholder="Filter by warehouse"
      clearable
      searchable
      data={['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D' , 'Warehouse E']}
    />
      </div>
      <EnhancedUpload/>

      <div className='flex justify-end'>
        <Button onClick={openUpload} className="!bg-hollywood-700 disabled:!bg-purple-300 !text-white !rounded-lg !mt-3"
        >Upload</Button>
      </div>
      </div>
      </Modal>
     
    
    </div>
  );
};

export default ProductManagement;

export const ProductItem = ({ data, quantity, onQuantityChange, onRemove }) => {
  return (
    <div className='flex justify-between items-center border-b border-gray-300 p-3'>
      <div className='flex gap-3 items-center'>
        <Trash 
          size={15} 
          className='text-red-500 cursor-pointer hover:text-red-700' 
          onClick={onRemove}
        />
        <div className='flex gap-3 items-center'>
          <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
           src={"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
            alt={data.name} 
          />
          <div>
            <p className='text-md font-semibold'>{data.name}</p>
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
        <p className="min-w-[20px] text-center">{quantity}</p>
        <Plus 
          size={15} 
          onClick={() => onQuantityChange(quantity + 1)} 
          className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
      </div>
      <p className="font-semibold">${data.price * quantity}</p>
    </div>
  );
};

const StatsCount = () => {
  return(
      <div className='grid grid-cols-5 gap-4 '>
          <div className='rounded-lg shadow-lg bg-white'>
<p className='bg-hollywood-700 text-white p-2 font-semibold rounded-t-lg'>Brands</p>
<div className='p-2'>

<p className='text-3xl font-semibold text-slate-400 '>230</p>
<p className='text-sm font-semibold text-slate-400'>last 30 days</p>
</div>
          </div>
          <div className='rounded-lg shadow-lg bg-white'>
<p className='bg-hollywood-700 text-white p-2 font-semibold rounded-t-lg'>Product</p>
<div className='p-2'>

<p className='text-3xl font-semibold text-slate-400 '>572</p>
<p className='text-sm font-semibold text-slate-400'>last 30 days</p>
</div>
          </div>
        </div>
  )
}

const EnhancedUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type === 'text/csv') {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        setUploadedFile(file);
        setIsUploading(false);
      }, 1500);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-md mx-auto  pt-4">
      <div
        className={`
          relative flex flex-col items-center justify-center gap-4 
          border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : uploadedFile 
              ? 'border-green-400 bg-green-50' 
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploadedFile ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-600">Uploading...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <div className="text-center">
              <p className="font-medium text-green-700">{uploadedFile.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(uploadedFile.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`
              p-3 rounded-full transition-colors duration-300
              ${isDragOver ? 'bg-blue-100' : 'bg-slate-200'}
            `}>
              {isDragOver ? (
                <Upload className="w-8 h-8 text-blue-600" />
              ) : (
                <FileAxis3d className="w-8 h-8 text-slate-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-700">
                {isDragOver ? 'Drop your CSV file here' : 'Upload CSV file'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {isDragOver ? 'Release to upload' : 'Click to browse or drag and drop'}
              </p>
            </div>
            <div className="text-xs text-slate-400 border-t pt-2 mt-2">
              Supports: CSV files only
            </div>
          </div>
        )}
      </div>
      
      {uploadedFile && (
        <div className="mt-4 p-4 bg-white border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">File Ready</h3>
          <p className="text-sm text-slate-600">
            Your CSV file has been uploaded successfully and is ready for processing.
          </p>
        </div>
      )}
    </div>
  );
};