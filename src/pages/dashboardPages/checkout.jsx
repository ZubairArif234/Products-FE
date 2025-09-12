import { Button, Group, Input, Radio, Stepper, Table, TextInput } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Minus, Plus, Trash } from 'lucide-react';
import { useForm } from '@mantine/form';

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || {};
  console.log(selectedItems, location?.state?.selectedItems, "selectedItem");
  
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className='py-5 px-20  rounded-lg '>
    <div className="p-5 bg-white rounded-lg shadow-md">
      <Stepper color={"#154d72"} active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step label="Review Cart">
          <StepOne selectedItems={selectedItems} />
        </Stepper.Step>
        <Stepper.Step label="Preference">
         <StepTwo/>
        </Stepper.Step>
        <Stepper.Step label="Client Details">
          <StepThree/>
        </Stepper.Step>
        <Stepper.Step label="Billing Address">
          <StepFour/>
        </Stepper.Step>
        <Stepper.Step label="Submit Order">
           <StepFive selectedItems={selectedItems} />
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group justify="end" mt="xl">
        {active > 0 && (

        <Button variant="default" onClick={prevStep}>Back</Button>
        )}
        <Button className='!bg-hollywood-700' onClick={nextStep}>Next step</Button>
      </Group>
    </div>
    </div>
      
  )
}

export default Checkout

const StepOne = ({ selectedItems: selectedItemsList }) => {
  const [selectedItems, setSelectedItems] = useState(selectedItemsList)
  const [itemQuantities, setItemQuantities] = useState({});

  // Initialize quantities when selectedItems change
  useEffect(() => {
    if (selectedItems) {
      const initialQuantities = {};
      selectedItems.forEach(item => {
        initialQuantities[item.id] = item.quantity || 1;
      });
      setItemQuantities(initialQuantities);
    }
  }, [selectedItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setItemQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  // CORRECTED: Filter by item.id instead of comparing entire objects
  const removeFromCart = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId)); 
    setItemQuantities(prev => { 
      const newQuantities = { ...prev };
      delete newQuantities[itemId]; 
      return newQuantities; 
    }); 
  };

  // Handle case where selectedItems is not available
  if (!selectedItems || selectedItems.length === 0) {
    return <div>No items selected for checkout.</div>;
  }

  const rows = selectedItems.map((element, i) => {
    const quantity = itemQuantities[element.id] || 1;
    const totalPrice = (element.price * quantity).toFixed(2);

    return (
      <Table.Tr key={element.id || i}>
        <Table.Td>
          <Trash size={20} 
            className='text-red-500 cursor-pointer hover:text-red-700' 
            onClick={() => removeFromCart(element.id)}/>
        </Table.Td>
        <Table.Td>
          <div className='flex items-center gap-3'>
            <img 
              className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
            src={"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
              alt={element.name} 
            />
            {element.name}
          </div>
        </Table.Td>
        <Table.Td>{element.description}</Table.Td>
        <Table.Td>{element.brand}</Table.Td>
        <Table.Td>
          <div className='flex items-center justify-between bg-slate-200 p-1 rounded-md'>
            <Minus
              size={15} 
              onClick={() => quantity > 1 && updateQuantity(element?.id, quantity - 1)} 
              className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
            />
            <p className="min-w-[20px] text-center">{quantity}</p>
            <Plus 
              size={15} 
              onClick={() => updateQuantity(element?.id, quantity + 1)} 
              className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
            />
          </div>
        </Table.Td>
        <Table.Td>${element.price}</Table.Td>
        <Table.Td>${totalPrice}</Table.Td>
      </Table.Tr>
    );
  });

  // Calculate total cart value
  const cartTotal = selectedItems.reduce((total, item) => {
    const quantity = itemQuantities[item.id] || 1;
    return total + (item.price * quantity);
  }, 0).toFixed(2);

  return (
    <div className='py-8'>
      <Table.ScrollContainer minWidth={500} type="native">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th/>
              <Table.Th>Product Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Brand</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Unit Price</Table.Th>
              <Table.Th>Total Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      
      <div className="mt-4 text-right">
        <h3 className="text-lg font-semibold">Cart Total: ${cartTotal}</h3>
      </div>
    </div>
  )
}

const StepTwo = () => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
          email: "",
          password: "",
        },
    
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
          password: (value) =>
            value.length < 8 ? "Password must have at least 8 characters" : null,
        },
      });
  return (
    <div className='w-2/3 mx-auto py-8'>
      <form onSubmit={form.onSubmit(()=>console.log("hi"))} className="flex flex-col gap-4">
        <TextInput
        label="Payment method"
                   size="sm"
                              radius="sm"
                    placeholder="Payment method"
                     {...form.getInputProps("email")}
                  />
                  <TextInput
                  label="Prep required"
                              size="sm"
                              radius="sm"
                              placeholder="Prep required"
                               {...form.getInputProps("password")}
                            />

                             <Radio.Group
     
      label="Ungetting Assistance"
      
    >
      <Group mt="xs">
        <Radio value="yes" label="Yes"
      color="grape" />
        <Radio value="no" label="No"color="grape" />
      </Group>
    </Radio.Group>
      </form>
    </div>
  )
}

const StepThree = () => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
          email: "",
          password: "",
        },
    
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
          password: (value) =>
            value.length < 8 ? "Password must have at least 8 characters" : null,
        },
      });
    return(
         <div className='w-2/3 mx-auto py-8'>
      <form onSubmit={form.onSubmit(()=>console.log("hi"))} className="grid grid-cols-2 gap-4">
        <TextInput
        label="First name"
                    size="sm"
                              radius="sm"
                    placeholder="First name"
                     {...form.getInputProps("email")}
                  />
                  <TextInput
                  label="Last name"
                             size="sm"
                              radius="sm"
                              placeholder="Last name"
                               {...form.getInputProps("password")}
                            />
                  <TextInput
                  label="Email"
                              size="sm"
                              radius="sm"
                              placeholder="Email"
                               {...form.getInputProps("password")}
                            />
                  <TextInput
                  label="Phone number"
                             size="sm"
                              radius="sm"
                              placeholder="Phone number"
                               {...form.getInputProps("password")}
                            />
                  <TextInput
                  label="Company"
                              size="sm"
                              radius="sm"
                              placeholder="Company"
                               {...form.getInputProps("password")}
                            />
                            <div className='grid grid-cols-2 gap-4'>

                  <TextInput
                  label="Market"
                  size="sm"
                              radius="sm"
                  placeholder="Market"
                  {...form.getInputProps("password")}
                  />
                  <TextInput
                  label="Storefront"
                  size="sm"
                              radius="sm"
                  placeholder="Storefront"
                  {...form.getInputProps("password")}
                  />
                  </div>

                            
      </form>
    </div>
    )
}

const StepFour = () => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
          email: "",
          password: "",
        },
    
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
          password: (value) =>
            value.length < 8 ? "Password must have at least 8 characters" : null,
        },
      });
    return(
         <div className='w-2/3 mx-auto py-8'>
      <form onSubmit={form.onSubmit(()=>console.log("hi"))} className="grid grid-cols-2 gap-4">
        <TextInput
        label="Street"
                    size="sm"
                              radius="sm"
                    placeholder="Street"
                     {...form.getInputProps("email")}
                  />
                  <TextInput
                  label="City"
                             size="sm"
                              radius="sm"
                              placeholder="City"
                               {...form.getInputProps("password")}
                            />
                  <TextInput
                  label="Zip/Postal Code"
                              size="sm"
                              radius="sm"
                              placeholder="Zip/Postal Code"
                               {...form.getInputProps("password")}
                            />
                  <TextInput
                  label="State"
                             size="sm"
                              radius="sm"
                              placeholder="State"
                               {...form.getInputProps("password")}
                            />
                  <TextInput
                  label="Country"
                              size="sm"
                              radius="sm"
                              placeholder="Country"
                               {...form.getInputProps("password")}
                            />
                  
                         

                            
      </form>
    </div>
    )
}

const StepFive = ({  selectedItems: selectedItemsList}) => {
     const [selectedItems, setSelectedItems] = useState(selectedItemsList)
  const [itemQuantities, setItemQuantities] = useState({});

  // Initialize quantities when selectedItems change
  useEffect(() => {
    if (selectedItems) {
      const initialQuantities = {};
      selectedItems.forEach(item => {
        initialQuantities[item.id] = item.quantity || 1;
      });
      setItemQuantities(initialQuantities);
    }
  }, [selectedItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setItemQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  // CORRECTED: Filter by item.id instead of comparing entire objects
  const removeFromCart = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId)); 
    setItemQuantities(prev => { 
      const newQuantities = { ...prev };
      delete newQuantities[itemId]; 
      return newQuantities; 
    }); 
  };

  // Handle case where selectedItems is not available
  if (!selectedItems || selectedItems.length === 0) {
    return <div>No items selected for checkout.</div>;
  }

  const rows = selectedItems.map((element, i) => {
    const quantity = itemQuantities[element.id] || 1;
    const totalPrice = (element.price * quantity).toFixed(2);

    return (
      <Table.Tr key={element.id || i}>
        <Table.Td>
          <Trash size={15} 
            className='text-red-500 cursor-pointer hover:text-red-700' 
            onClick={() => removeFromCart(element.id)}/>
        </Table.Td>
        <Table.Td>
          <div className='flex items-center gap-3 line-clamp-1'>
            {/* <img 
              className='h-6 w-6 aspect-square object-contain bg-slate-200 rounded' 
             src={"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
              alt={element.name} 
            /> */}
            {element.name}
          </div>
        </Table.Td>
        <Table.Td >{element.description}</Table.Td>
        <Table.Td>{element.brand}</Table.Td>
        <Table.Td>
          <div className='flex items-center justify-between bg-slate-200 p-1 rounded-md'>
            <Minus
              size={15} 
              onClick={() => quantity > 1 && updateQuantity(element?.id, quantity - 1)} 
              className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
            />
            <p className="min-w-[20px] text-center">{quantity}</p>
            <Plus 
              size={15} 
              onClick={() => updateQuantity(element?.id, quantity + 1)} 
              className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
            />
          </div>
        </Table.Td>
        <Table.Td>${element.price}</Table.Td>
        <Table.Td>${totalPrice}</Table.Td>
      </Table.Tr>
    );
  });

  // Calculate total cart value
  const cartTotal = selectedItems.reduce((total, item) => {
    const quantity = itemQuantities[item.id] || 1;
    return total + (item.price * quantity);
  }, 0).toFixed(2);

    return(
         <div className=' py-8'>
    <div className='grid grid-cols-2 gap-4'>
        <div>
             <Table.ScrollContainer minWidth={500} type="native">
        <Table>
          <Table.Thead>
            <Table.Tr>
                <Table.Th/>
              <Table.Th>Product Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Brand</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Unit Price</Table.Th>
              <Table.Th>Total Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

        </div>
        <div className='flex flex-col gap-3'>
            <div>
                {/* client details */}
                <p className='border border-slate-200 rounded-t-lg py-2 px-3 bg-hollywood-700 text-white font-semibold'>Client Details</p>
                <div className='grid grid-cols-2 gap-4 border border-t-0 py-2 px-3 rounded-b-lg border-slate-200 text-sm text-slate-600'>

                    <p>First name : Zubair </p>
                    <p>Last name : Arif </p>
                    <p>Email : zubarif234@gmail.com </p>
                    <p>Phone : 09886754231 </p>
                    <p>Company : Novasphere Sol </p>
                    <p>Market : Evelance </p>

                </div>
            </div>
        
            <div>
                {/* client address */}
                <p className='border border-slate-200 rounded-t-lg py-2 px-3 bg-hollywood-700 text-white font-semibold'>Billing Address</p>
                <div className='grid grid-cols-2 gap-4 border border-t-0 py-2 px-3 rounded-b-lg border-slate-200 text-sm text-slate-600'>

                    <p>Steet Address : HNO#03 main city hospital street near fan club bar. </p>
                    <p>City : Ohio </p>
                    <p>Zip/Postal Code : 089367 </p>
                    <p>State : Eastern </p>
                    <p>Country : London </p>
                    

                </div>
            </div>

             <div>
                {/* prep */}
                <p className='border border-slate-200 rounded-t-lg py-2 px-3 bg-hollywood-700 text-white font-semibold'>Preference</p>
                <div className='grid grid-cols-2 gap-4 border border-t-0 py-2 px-3 rounded-b-lg border-slate-200 text-sm text-slate-600'>

                    <p>Payment Method : Cash on delivery </p>
                    <p>Prep Required : No </p>
                    
                    

                </div>
            </div>

        </div>

    </div>

    <div className='text-end text-slate-600 mt-8'>
        <p>Total items : {selectedItems?.length}</p>
        <p>Tax : $10.89</p>
        <p className='text-xl font-semibold'>Total Price : ${cartTotal} </p>
    </div>
    </div>
    )
}