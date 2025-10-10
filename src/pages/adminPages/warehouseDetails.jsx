import { useEffect, useMemo, useState } from 'react';
import { Button, Table, TextInput, Modal, Loader, Group, ActionIcon, Divider, Pagination, Tooltip, Tabs, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { SquarePen, Trash, Plus, Search, Eye, ChevronDown } from 'lucide-react';
import { useWarehouse } from '../../hooks/useWarehouse';
import custAxios, { attachToken } from '../../configs/axios.config';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { changeOrderStatus, useOrders } from '../../hooks/useOrder';
import moment from 'moment';
import { applyRoiCap, toNum } from '../../utils/helper';

const PAGE_SIZE = 10;

const WarehouseDetails = () => {
    const [filters, setFilters] = useState({
      title: "",
      warehouse: "",
      page: 1,
      limit: 6,
    });
  const { warehouse, isPending, refetch } = useWarehouse({});
  const queryClient = useQueryClient();
  const location = useLocation();
  const warehouseState = location.state?.warehouse;
  console.log(warehouseState, "warehouseState");
  const {products, isPending:isPendingProducts} = useProducts({...filters, warehouse: warehouseState._id})

  const {orders, isPending:isPendingOrders} = useOrders({...filters, warehouse: warehouseState._id})
  
  const { mutateAsync } = changeOrderStatus();
  const [isAddOpen, addModal] = useDisclosure(false);
  const [isEditOpen, editModal] = useDisclosure(false);
  const [isDeleteOpen, deleteModal] = useDisclosure(false);

  const [formValues, setFormValues] = useState({ name: '', description: '', country: '', city: '' });
  const [formErrors, setFormErrors] = useState({});
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const warehouses = warehouse?.warehouses || [];
  const totalPages = useMemo(() => {
    const total = warehouse?.pagination?.totalPages;
    if (typeof total === 'number' && total > 0) return total;
    // fallback if API doesn't send pagination meta
    return Math.max(1, Math.ceil(warehouses.length / PAGE_SIZE));
  }, [warehouse, warehouses.length]);

  const resetForm = () => {
    setFormValues({ name: '', description: '', country: '', city: '' });
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formValues.name?.trim()) errors.name = 'Name is required';
    if (!formValues.description?.trim()) errors.description = 'Description is required';
    if (!formValues.country?.trim()) errors.country = 'Country is required';
    if (!formValues.city?.trim()) errors.city = 'City is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onAdd = () => {
    resetForm();
    addModal.open();
  };

  const onEdit = (row) => {
    setEditingWarehouse(row);
    setFormValues({
      name: row?.name || '',
      description: row?.description || '',
      country: row?.country || '',
      city: row?.city || '',
    });
    setFormErrors({});
    editModal.open();
  };

  const onDelete = (row) => {
    setEditingWarehouse(row);
    deleteModal.open();
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      attachToken();
      const res = await custAxios.post('/warehouse', payload);
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
      addModal.close();
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      attachToken();
      const res = await custAxios.put(`/warehouse/${id}`, payload);
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
      editModal.close();
      setEditingWarehouse(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      attachToken();
      const res = await custAxios.delete(`/warehouse/${id}`);
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
      deleteModal.close();
      setEditingWarehouse(null);
    },
  });

  const handleSubmitAdd = () => {
    if (!validate()) return;
    createMutation.mutate({
      name: formValues.name.trim(),
      description: formValues.description?.trim() || '',
      country: formValues.country?.trim() || '',
      city: formValues.city?.trim() || '',
    });
  };

  const handleSubmitEdit = () => {
    if (!validate()) return;
    updateMutation.mutate({
      id: editingWarehouse?._id,
      payload: {
        name: formValues.name.trim(),
        description: formValues.description?.trim() || '',
        country: formValues.country?.trim() || '',
        city: formValues.city?.trim() || '',
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!editingWarehouse?._id) return;
    deleteMutation.mutate(editingWarehouse._id);
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, title: value, page: 1 }));
  };

  const handleChangeOrderStatus = (value, id) => {
    mutateAsync({status:value,id:id},)
  }

  useEffect(() => {
    // refetch when filters change if backend supports params
    refetch?.();
  }, [filters.page, filters.limit, filters.title]);

  const isBusy = isPending || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;


  const rows = products?.products?.map((element, i) => {
     const basePrice0 = toNum(element.price);
      const amazonBb = toNum(element.amazonBb);
      const amazonFees = toNum(element.amazonFees);
    
      const { basePrice, profit, margin, roi } = applyRoiCap(basePrice0, amazonBb, amazonFees);
    
return (

    <Table.Tr key={i} >
      
      <Table.Td>
        <div className='flex items-center gap-2 capitalize'>
           <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
           src={element?.images?.length > 0 ? element?.images[0] : null}
            alt={element.name} 
          />
          <Link to={`http://amazon.com/dp/${element.asin}`} target='_blank' title={element.name} className='text-md font-semibold line-clamp-2 hover:text-hollywood-600'>
                     {element.name}
                   </Link>
          </div>
          </Table.Td>
      <Table.Td>{element.brand}</Table.Td>
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
)
  
});

  const ordersRows = orders?.orders?.map((element, i) => (
    <Table.Tr key={i} >
    
     
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
      {/* <Table.Td ><Eye onClick={()=>{setSingleOrder(element); open()}} size={15} className='hover:text-green-500 cursor-pointer' /></Table.Td> */}
    
    </Table.Tr>
  ));
  return (
    <div className="py-5 px-2">
      <div className='flex items-center justify-between'>
        <div>
            <p className="font-bold text-hollywood-700 text-lg">{warehouseState?.name}</p>
         
          {/* <p className='text-3xl mb-1 capitalize'>{warehouseState?.name}</p> */}
          <p className='text-sm text-slate-500'>{warehouseState?.description}</p>
        </div>
        {/* <Button onClick={onAdd} leftSection={<Plus size={16}/>} className='!bg-hollywood-700 !text-white !rounded-lg'>Add warehouse</Button> */}
      </div>
      {/* <Divider my={20}/> */}

<div className='bg-white p-3  mt-4'>

      <Tabs defaultValue="products">
      <Tabs.List>
        <Tabs.Tab value="products" >
          Products
        </Tabs.Tab>
        <Tabs.Tab value="orders" >
          Orders
        </Tabs.Tab>
      
      </Tabs.List>

      <Tabs.Panel value="products">
    {isPendingProducts ?
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
       <div className='flex justify-end mt-4'>
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
      </Tabs.Panel>

      <Tabs.Panel value="orders">
       {
        
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
             <Table.Tbody>{ordersRows}</Table.Tbody>
           </Table>
         </Table.ScrollContainer>:
         <div className='my-20 flex flex-col justify-center items-center'>
 <p className='text-xl font-semibold'>No Orders Found</p>
 <p className='text-sm text-slate-400'>There are no order based on the search</p>
         </div>
       }
      </Tabs.Panel>

     
    </Tabs>
</div>

     

      {/* Add Modal */}
      <Modal opened={isAddOpen} onClose={addModal.close} centered title="Add warehouse">
        <div>
          <TextInput
            label="Name"
            placeholder="Enter warehouse name"
            value={formValues.name}
            onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
            error={formErrors.name}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            value={formValues.description}
            onChange={(e) => setFormValues((p) => ({ ...p, description: e.target.value }))}
            mt={12}
            error={formErrors.description}
            required
          />
          <div className='grid grid-cols-2 gap-3 mt-3'>
            <TextInput
              label="Country"
              placeholder="Country"
              value={formValues.country}
              onChange={(e) => setFormValues((p) => ({ ...p, country: e.target.value }))}
              error={formErrors.country}
              required
            />
            <TextInput
              label="City"
              placeholder="City"
              value={formValues.city}
              onChange={(e) => setFormValues((p) => ({ ...p, city: e.target.value }))}
              error={formErrors.city}
              required
            />
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button variant='default' onClick={addModal.close}>Cancel</Button>
            <Button onClick={handleSubmitAdd} className='!bg-hollywood-700 !text-white'>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={isEditOpen} onClose={editModal.close} centered title="Edit warehouse">
        <div>
          <TextInput
            label="Name"
            placeholder="Enter warehouse name"
            value={formValues.name}
            onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
            error={formErrors.name}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            value={formValues.description}
            onChange={(e) => setFormValues((p) => ({ ...p, description: e.target.value }))}
            mt={12}
            error={formErrors.description}
            required
          />
          <div className='grid grid-cols-2 gap-3 mt-3'>
            <TextInput
              label="Country"
              placeholder="Country"
              value={formValues.country}
              onChange={(e) => setFormValues((p) => ({ ...p, country: e.target.value }))}
              error={formErrors.country}
              required
            />
            <TextInput
              label="City"
              placeholder="City"
              value={formValues.city}
              onChange={(e) => setFormValues((p) => ({ ...p, city: e.target.value }))}
              error={formErrors.city}
              required
            />
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button variant='default' onClick={editModal.close}>Cancel</Button>
            <Button onClick={handleSubmitEdit} className='!bg-hollywood-700 !text-white'>Update</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal opened={isDeleteOpen} onClose={deleteModal.close} centered title="Delete warehouse">
        <div>
          <p>Are you sure you want to delete "{editingWarehouse?.name}"?</p>
          <div className='flex justify-end gap-2 mt-4'>
            <Button variant='default' onClick={deleteModal.close}>Cancel</Button>
            <Button color='red' onClick={handleConfirmDelete} className='!text-white'>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WarehouseDetails;


