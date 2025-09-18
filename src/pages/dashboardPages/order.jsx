import { Button, Table, Checkbox, Drawer, Divider, TextInput, Select, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Eye, Minus, Plus, Search, SquarePen, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { userGetData } from '../../services/hooks';
import { useMyOrders, useOrders } from '../../hooks/useOrder';
import moment from 'moment/moment';

const Orders = () => {
    
   const [filters, setFilters] = useState({
      title: "",
      page: 1,
      limit: 6,
    });
      const {orders, isPending} = useMyOrders(filters)
      console.log(orders);
      
      const userData = userGetData()
       
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

console.log(singleOrder);

  // Calculate total price whenever itemQuantities changes
  useEffect(() => {
    const total = selectedRows.reduce((sum, rowId) => {
      const item = products?.find(el => el._id === rowId);
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

  const rows = orders?.map((element, i) => (
    <Table.Tr key={i} className={selectedRows.includes(element._id) ? '!bg-hollywood-700/80 text-white' : undefined}>
      {/* <Table.Td>
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
      </Table.Td> */}
     
      <Table.Td>#{element._id}</Table.Td>
      <Table.Td>{element.products?.length}</Table.Td>
      <Table.Td>{element.clientDetails?.firstName + " " + element.clientDetails?.lastName}</Table.Td>
      <Table.Td>${element.totalPrice}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{moment(element.createdAt).format('DD-MMM-YYYY')}</Table.Td>
      <Table.Td ><Eye onClick={()=>{setSingleOrder(element); open()}} size={15} className='hover:text-green-500 cursor-pointer' /></Table.Td>
    
    </Table.Tr>
  ));

  const handleSearch = (value) => {
  setFilters((prev) => ({
    ...prev,
    title: value,   // update title
    page: 1         // reset page to 1 when searching
  }));
};
  return (
    <div className="py-5 px-20  ">
      
      <div className='bg-white p-2 rounded-lg shadow-lg'>

        <div className=''>
          <p className="font-bold text-hollywood-700 text-lg">Order</p>
          {/* <p className="text-sm text-gray-500">There are {elements.length} products</p> */}
        </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <TextInput placeholder='Search order by ID' value={filters.title}
  onChange={(e) => handleSearch(e.target.value)} leftSection={<Search size={18}  />}/>
         
        </div>
      
      </div>

      

 <div className='capitalize'>
        {isPending  ? 
        <div className='my-20 flex justify-center'>

            <Loader color="#255b7f" />
        </div>
         :
         orders?.length > 0  ?
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
                <p>Client Name : {singleOrder?.clientDetails?.firstName + " " + singleOrder?.clientDetails?.lastName}</p>
                <p> Email : {singleOrder?.clientDetails?.email}</p>
                <p> Phone : {singleOrder?.clientDetails?.phone}</p>
            </div>

            <div>
                <p className='text-lg  text-slate-500'>Item Purchased</p>
                <div className=' max-h-[250px] overflow-auto'>

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
            <p>{item?.unitPrice} </p>
            <p>= ${item?.qnt * item?.unitPrice?.split("$")[1]}</p>
                </div>
    )
})}
                </div>
            </div>

            <div className=' mt-4 text-end'>
                <p className='text-md text-slate-600'>Tax : ${singleOrder?.tax}</p>
                <p className='text-xl '>Total Price : ${singleOrder?.totalPrice}</p>
            </div>
        </div>
        </Modal>
    </div>
  );
};

export default Orders;

