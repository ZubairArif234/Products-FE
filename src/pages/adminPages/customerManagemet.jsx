import { Button, Table, Checkbox, Drawer, Divider, TextInput, Select, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Eye, Mail, Minus, Phone, Plus, Search, SquarePen, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { userGetData } from '../../services/hooks';
import { changeOrderStatus, useOrders } from '../../hooks/useOrder';
import moment from 'moment/moment';
import { useUsers } from '../../hooks/useUser';

const CustomerManagement = () => {
    const { mutateAsync } = changeOrderStatus();
   const [filters, setFilters] = useState({
      title: "",
      orderId: "",
      page: 1,
      limit: 1000,
    });
      const {user} = useUsers(filters)
      const {orders, isPending} = useOrders(filters)
      console.log(user);
      
       
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

  const rows = user?.users?.map((element, i) => (
    <Table.Tr key={i} className={selectedRows.includes(element._id) ? '!bg-hollywood-700/80 text-white' : undefined}>
    
     
      <Table.Td>#{element._id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.phone || " - "}</Table.Td>
      <Table.Td>{element.bio || " - "}</Table.Td>
      <Table.Td>{moment(element.createdAt).format('DD-MMM-YYYY')}</Table.Td>
      <Table.Td > 
      <Link to="/admin/customer-details" state={{ data: element }}>
  <Eye size={15} className="hover:text-green-500 cursor-pointer" />
</Link>
        </Table.Td>
    
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
    <div className="py-5  px-2 ">
      
      <div className='bg-white p-2 '>

        <div className=''>
          <p className="font-bold text-hollywood-700 text-lg">Customers</p>
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
         user?.users?.length > 0  ?
        <Table.ScrollContainer minWidth={500} type="native">
          <Table>
            <Table.Thead>
              <Table.Tr>
                {/* <Table.Th /> */}
                <Table.Th>Id</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone Number</Table.Th>
                <Table.Th>Bio</Table.Th>
                <Table.Th>Created At</Table.Th>
                <Table.Th/>
               
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>:
        <div className='my-20 flex flex-col justify-center items-center'>
<p className='text-xl font-semibold'>No Customer Found</p>
<p className='text-sm text-slate-400'>There are no customer based on the search</p>
        </div>
        }
      </div>

      </div>

     
    </div>
  );
};

export default CustomerManagement;

