import { Button, Table, Checkbox, Drawer, Divider, TextInput, Select, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Eye, Mail, Minus, Phone, Plus, Search, SquarePen, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { userGetData } from '../../services/hooks';
import { changeOrderStatus, useOrders } from '../../hooks/useOrder';
import moment from 'moment/moment';

const CustomerDetails = () => {
    const { mutateAsync } = changeOrderStatus();
    const {state} = useLocation()
    console.log(state , "state");
    
   const [filters, setFilters] = useState({
      title: "",
      orderId: "",
      page: 1,
      limit: 6,
    });
      const {orders, isPending} = useOrders({...filters,user:state?.data?._id})
      console.log(orders);
      
       
  const [opened, { open, close }] = useDisclosure(false);

  const [singleOrder, setSingleOrder] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const products = [
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
      const item = products?.find(el => el._id === rowId);
      const quantity = itemQuantities[rowId] || 1;
      return sum + (item.price * quantity);
    }, 0);
    setTotalPrice(total);
  }, [selectedRows, itemQuantities]);


  const handleChangeOrderStatus = (value, id) => {
    mutateAsync({status:value,id:id},)
  }

  const totalQuantity = singleOrder?.products.reduce((sum, item) => sum + item.qnt, 0);


  const rows = orders?.orders?.map((element, i) => (
    <Table.Tr key={i} className={selectedRows.includes(element._id) ? '!bg-hollywood-700/80 text-white' : undefined}>
    
     
      <Table.Td>#{element._id}</Table.Td>
      <Table.Td>{element.products?.length}</Table.Td>
      <Table.Td>{element.clientDetails?.firstName + " " + element.clientDetails?.lastName}</Table.Td>
      <Table.Td>${element.totalPrice}</Table.Td>
      <Table.Td><Select
      onChange={(value)=>handleChangeOrderStatus(value , element?._id)}
      className='!capitalize'
      size='sm'
    rightSection={<ChevronDown size={18} />}
      placeholder="Filter by brand"
      defaultValue={element.status}
      data={[{label:"Review",value:'review'},{label:"Pending",value:'pending'},{label:"Paid",value:'paid'}, {label:"Confirmed",value:'confirmed'}, {label:"Shipped",value:'shipped'}, {label:"Cancelled",value:'cancelled'} ]}
    
     /></Table.Td>
      <Table.Td>{moment(element.createdAt).format('DD-MMM-YYYY')}</Table.Td>
      <Table.Td ><Eye onClick={()=>{setSingleOrder(element); open()}} size={15} className='hover:text-green-500 cursor-pointer' /></Table.Td>
    
    </Table.Tr>
  ));

  const handleSearch = (value) => {
  setFilters((prev) => ({
    ...prev,
    orderId: value,   // update title
    page: 1         // reset page to 1 when searching
  }));
};
  return (
    <div className="py-5  px-2  ">
       <div className='my-4 '>
         <p className="font-bold capitalize text-hollywood-700 text-lg">{state?.data?.name}</p>
         
          {/* <p className='text-3xl mb-1 capitalize'>{state?.data?.name}</p> */}
          <p className='text-sm text-slate-500'>{state?.data?.email}</p>
        </div>
      <div className='bg-white p-2 '>

        <div className=''>
          <p className="font-bold text-hollywood-700 text-lg">Order</p>
          {/* <p className="text-sm text-gray-500">There are {elements.length} products</p> */}
        </div>
      <div className='flex justify-between items-center'>
        {/* <div className='flex gap-4 items-center'>
          <TextInput placeholder='Search order by ID' value={filters.orderId}
  onChange={(e) => handleSearch(e.target.value)} leftSection={<Search size={18}  />}/>
         
        </div> */}
      
      </div>

      

 <div className='capitalize'>
        {isPending  ? 
        <div className='my-20 flex justify-center'>

            <Loader color="#255b7f" />
        </div>
         :
         orders?.orders?.length > 0  ?
        <Table.ScrollContainer minWidth={500} type="native">
          <Table>
            <Table.Thead>
              <Table.Tr>
                {/* <Table.Th /> */}
                <Table.Th>Id</Table.Th>
                <Table.Th>No of products</Table.Th>
                <Table.Th>Client name</Table.Th>
                <Table.Th>Total price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Order at</Table.Th>
                <Table.Th/>
               
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>:
        <div className='my-20 flex flex-col justify-center items-center'>
<p className='text-xl font-semibold'>No Orders Found</p>
<p className='text-sm text-slate-400'>There are no order based on the search</p>
        </div>
        }
      </div>

      </div>

     <Modal opened={opened} onClose={close} centered title="Order Details">
       <div className='capitalize'>
            <div className='mb-2 text-md text-slate-700'>
                <p className='font-semibold text-lg'> {singleOrder?.clientDetails?.firstName + " " + singleOrder?.clientDetails?.lastName}</p>
                <p className='text-sm text-slate-400 flex items-center gap-2'> <Mail size={16}/>  {singleOrder?.clientDetails?.email}</p>
                <p className='text-sm text-slate-400 flex items-center gap-2'> <Phone size={16}/> {singleOrder?.clientDetails?.phone}</p>
            </div>

            <div>
                <p className='font-semibold text-slate-500'>Items</p>
                <div className='border border-slate-200 rounded-lg my-2 p-2 max-h-[250px] overflow-auto'>

{singleOrder?.products?.map((item,i)=>{
    return(

                <div key={i} className='flex justify-between items-center  border-b-1 p-2 border-slate-200 '>
                    <div className='flex gap-2 items-center'>

                     <img 
            className='h-10 w-10 aspect-square object-contain bg-slate-200 rounded' 
            src={item?.product?.images?.length > 0 ? item?.product?.images[0] : "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
           
            />
            <p className='line-clamp-1 w-28' title={item?.product?.name}>{item?.product?.name}</p>
            </div>
            <p>{item?.qnt}  x </p>
            <p>{Number(item?.product?.price).toFixed(2)} </p>
           <p>= ${(item?.qnt * Number(item?.product?.price)).toFixed(2)}</p>
              
            </div>
    )
})}
                </div>
            </div>

           


             <div>
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>
                ${(parseFloat(singleOrder?.totalPrice) - parseFloat(singleOrder?.tax) - 
                  (singleOrder?.preference?.prepRequired !== "No Prep" ? totalQuantity : 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>${singleOrder?.tax}</span>
            </div>
            {singleOrder?.preference?.prepRequired !== "No Prep" && (
              <div className="flex justify-between text-slate-600">
                <span>Prep Charges</span>
                <span>${totalQuantity?.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-300 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-800">Total</span>
                <span className="text-2xl font-bold text-slate-900">
                  ${singleOrder?.totalPrice}
                </span>
              </div>
            </div>
            </div>
            </div>
        </div>
        </Modal>
    </div>
  );
};

export default CustomerDetails;

