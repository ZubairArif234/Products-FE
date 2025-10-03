import { Button, Table, Checkbox,Drawer, Divider, TextInput, Select,Modal, Loader, Pagination } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, FileAxis3d, Minus, Plus, Upload, CheckCircle2, X, Search, SquarePen, Trash, ThumbsUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createProductsByCSV, useProducts } from '../../hooks/useProducts';
import { useWarehouse } from '../../hooks/useWarehouse';
import { userGetData } from '../../services/hooks';
import { applyRoiCap, toNum } from '../../utils/helper';

const ProductManagement = () => {
     const [filters, setFilters] = useState({
    title: "",
    warehouse: "",
    page: 1,
    limit: "20",
  });
  const userData = userGetData()
    const {products, isPending} = useProducts(filters)
    const {warehouse, isPending:isPendingWarehouse} = useWarehouse({})
   console.log(warehouse);
   
  
   const { isPending: isCreateProductPending, mutateAsync } = createProductsByCSV();
   const [opened, { open, close }] = useDisclosure(false);
   const [selectedRows, setSelectedRows] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

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


  // --- helpers ---


// --- table rows ---
const rows = products?.products?.map((element, i) => {
  const basePrice0 = toNum(element.price);
  const amazonBb = toNum(element.amazonBb);
  const amazonFees = toNum(element.amazonFees);

  const { basePrice, profit, margin, roi } = applyRoiCap(basePrice0, amazonBb, amazonFees);

  return (
    <Table.Tr
      key={i}
      className={selectedRows.includes(element._id) ? '!bg-hollywood-700/80 text-white' : undefined}
    >
      

      <Table.Td>
        <div className='flex rounded-lg p-2 justify-start gap-2 items-center'>
          <p className='font-semibold'>{element.brand}</p>
        </div>
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
          <Link
            to={`http://amazon.com/dp/${element.asin}`}
            target='_blank'
            title={element.name}
            className='text-md font-semibold line-clamp-3 hover:text-hollywood-600'
          >
            {element.name}
          </Link>
        </div>
      </Table.Td>

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
const handleUpload = () => {
  const validationErrors = {};
  if (!selectedWarehouse) {
    validationErrors.warehouse = "Please select a warehouse";
  }
  if (!file) {
    validationErrors.file = "Please upload a CSV file";
  }
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  // ✅ Both validations passed - provide values (replace with API call as needed)
  console.log({ warehouseId: selectedWarehouse, file });
  const formData = new FormData();
  formData.append("warehouse", selectedWarehouse);
  formData.append("file", file);
  mutateAsync(formData);
  // close();
};

const handlePageLimit = (value) => {
  setFilters((prev) => ({
    ...prev,
    limit: value,
    page: 1,
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
    <div className="py-5    rounded-lg shadow-md">
      <div className=' bg-gradient-to-r from-hollywood-700 via-hollywood-700  to-white py-12 px-2 md:px-20'>
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
      <div className='bg-white p-2 '>

        <div className=''>
          <p className="font-bold text-hollywood-700 text-lg">Products</p>
          {/* <p className="text-sm text-gray-500">There are {elements.length} products</p> */}
        </div>
      <div className='flex justify-between items-center flex-wrap'>
        <div className='flex gap-4 items-center '>
          <TextInput placeholder='Search Product' value={filters.title}
  onChange={(e) => handleSearch(e.target.value)} leftSection={<Search size={18}  />}/>
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
         products?.products?.length > 0  ?
         <div>

        <Table.ScrollContainer  minWidth={500} type="native">
          <Table>
            <Table.Thead>
              <Table.Tr>
                {/* <Table.Th /> */}
                <Table.Th>Brand</Table.Th>
                <Table.Th>Product Name</Table.Th>
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

  <Modal opened={opened} onClose={close} centered title="Upload CSV">
      <div>
      <div className=''>
        {/* <p className='text-md font-semibold'>Select Warehouse</p> */}
         <Select
    rightSection={<ChevronDown size={18} />}
      placeholder="Filter by warehouse"
      clearable
      searchable
      value={selectedWarehouse}
      onChange={setSelectedWarehouse}
      data={warehouse?.warehouses?.map((element)=>{return({
        label:element.name,
        value:element._id
      })})}
      error={errors.warehouse}
    />
      </div>
      <EnhancedUpload value={file} onChange={setFile} error={errors.file}/>

      <div className='flex justify-end'>
        <Button loading={isCreateProductPending} onClick={handleUpload} className="!bg-hollywood-700 disabled:!bg-purple-300 !text-white !rounded-lg !mt-3"
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

const EnhancedUpload = ({ value, onChange, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
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

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const isCsvMime = selectedFile.type === 'text/csv' || selectedFile.type === 'application/vnd.ms-excel';
    const isCsvName = selectedFile.name?.toLowerCase().endsWith('.csv');
    if (isCsvMime || isCsvName) {
      setIsUploading(true);
      setTimeout(() => {
        onChange?.(selectedFile);
        setIsUploading(false);
      }, 500);
    } else {
      onChange?.(null);
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
    onChange?.(null);
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
            : value 
              ? 'border-green-400 bg-green-50' 
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!value ? handleClick : undefined}
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
        ) : value ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <div className="text-center">
              <p className="font-medium text-green-700">{value.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(value.size)}</p>
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
      
      {value && (
        <div className="mt-4 p-4 bg-white border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">File Ready</h3>
          <p className="text-sm text-slate-600">
            Your CSV file has been uploaded successfully and is ready for processing.
          </p>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};