import { Button, Group, Input, Radio, Stepper, Table, TextInput } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash } from 'lucide-react';
import { useForm } from '@mantine/form';
import { createOrder } from '../../hooks/useOrder';

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || {};
  console.log(selectedItems, location?.state?.selectedItems, "selectedItem");
  const { isPending, mutateAsync } = createOrder();
  const [active, setActive] = useState(0);
  const navigate = useNavigate()
  // State to track updated quantities from StepOne and StepFive
  const [cartItems, setCartItems] = useState(selectedItems || []);
  const [itemQuantities, setItemQuantities] = useState({});

  // Initialize quantities when selectedItems change
  useEffect(() => {
    if (selectedItems) {
      const initialQuantities = {};
      selectedItems.forEach(item => {
        initialQuantities[item._id] = item.quantity || 1;
      });
      setItemQuantities(initialQuantities);
      setCartItems(selectedItems);
    }
  }, [selectedItems]);

  const form = useForm({
        mode: "uncontrolled",
        initialValues: {
          paymentMethod: "",
          prepRequired: "",
          assistance: "",

          firstName:"",
          lastName:"",
          email:"",
          phone:"",
          company:"",
          market:"",
          storeFront:"",

          street:"",
          city:"",
          postalCode:"",
          state:"",
          country:""
        },
    
        validate: {
          paymentMethod: (value) => (active == 1 && value?.trim()?.length < 1  ? "Payment method is required" : null),
          prepRequired: (value) => (active == 1 && value?.trim()?.length < 1  ? "Prep is required" : null),
          
          firstName: (value) => (active == 2 && value?.trim()?.length < 1  ? "First name is required" : null),
          lastName: (value) => (active == 2 && value?.trim()?.length < 1  ? "Last name is required" : null),
          email: (value) => (active == 2 && value?.trim()?.length < 1  ? "Email is required" : null),
          phone: (value) => (active == 2 && value?.trim()?.length < 1  ? "Phone is required" : null),
          company: (value) => (active == 2 && value?.trim()?.length < 1  ? "Company is required" : null),
          market: (value) => (active == 2 && value?.trim()?.length < 1  ? "Market is required" : null),
          storeFront: (value) => (active == 2 && value?.trim()?.length < 1  ? "Store front is required" : null),
          
          street: (value) => (active == 3 && value?.trim()?.length < 1  ? "Street is required" : null),
          city: (value) => (active == 3 && value?.trim()?.length < 1  ? "City is required" : null),
          postalCode: (value) => (active == 3 && value?.trim()?.length < 1  ? "Postal code is required" : null),
          state: (value) => (active == 3 && value?.trim()?.length < 1  ? "State is required" : null),
          country: (value) => (active == 3 && value?.trim()?.length < 1  ? "Country is required" : null),
        },
      });

  const nextStep = async () => {
    const formValidation = form.validate();
    
    if (!formValidation?.hasErrors) {
      // If we're at the final step (step 4), submit the order
      if (active === 4) {
        try {
          // Calculate total cart value
          const cartTotal = cartItems.reduce((total, item) => {
            const quantity = itemQuantities[item._id] || 1;
            return total + (item.price * quantity);
          }, 0);

          const payload = {
            // You'll need to get this from your auth context or user state
            // user: currentUser.id, // Add this based on your auth implementation
            
            products: cartItems.map(item => ({
              product: item._id, // This should be the MongoDB ObjectId
              qnt: itemQuantities[item.id] || 1,
              unitPrice: item.price
            })),
            
            clientDetails: {
              firstName: form?.values?.firstName,
              lastName: form?.values?.lastName,
              email: form?.values?.email,
              phone: form?.values?.phone,
              company: form?.values?.company,
              market: form?.values?.market,
              storeFront: form?.values?.storeFront,
            },
            
            billingAddress: {
              street: form?.values?.street,
              city: form?.values?.city,
              postalCode: form?.values?.postalCode,
              state: form?.values?.state,
              country: form?.values?.country,
            },
            
            preference: {
              paymentMethod: form.values?.paymentMethod,
              prepRequired: form?.values?.prepRequired,
              assistance: form?.values?.assistance
            },
            
            tax: "10.89", // You can calculate this dynamically
            totalPrice: (cartTotal + 10.89).toFixed(2) // Adding tax
          };

          console.log("Order payload:", payload);
          
          // Submit the order
          await mutateAsync(payload);
          
          // Move to completion step
          setActive((current) => (current < 4 ? current + 1 : current));
        } catch (error) {
          console.error("Error creating order:", error);
          // Handle error (show notification, etc.)
        }
        finally{
          navigate("/dashboard/order")
        }
      } else {
        // Regular step progression
        setActive((current) => (current < 4 ? current + 1 : current));
      }
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className='py-5 px-20  rounded-lg '>
    <div className="p-5 bg-white rounded-lg shadow-md">
      <Stepper color={"#154d72"} active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step label="Review Cart">
          <StepOne 
            selectedItems={cartItems} 
            setSelectedItems={setCartItems}
            itemQuantities={itemQuantities}
            setItemQuantities={setItemQuantities}
          />
        </Stepper.Step>
        <Stepper.Step label="Preference">
         <StepTwo form={form}/>
        </Stepper.Step>
        <Stepper.Step label="Client Details">
          <StepThree form={form}/>
        </Stepper.Step>
        <Stepper.Step label="Billing Address">
          <StepFour form={form}/>
        </Stepper.Step>
        <Stepper.Step label="Submit Order">
           <StepFive 
             selectedItems={cartItems} 
             form={form} 
             itemQuantities={itemQuantities}
             setItemQuantities={setItemQuantities}
           />
        </Stepper.Step>
        <Stepper.Completed>
          Order completed successfully! Click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group justify="end" mt="xl">
        {active > 0 && (
          <Button variant="default" onClick={prevStep}>Back</Button>
        )}
        {active < 5 && (
          <Button 
            className='!bg-hollywood-700' 
            onClick={nextStep}
            loading={isPending}
          >
            {active === 4 ? 'Submit Order' : 'Next step'}
          </Button>
        )}
      </Group>
    </div>
    </div>
      
  )
}

export default Checkout

const StepOne = ({ selectedItems, setSelectedItems, itemQuantities, setItemQuantities }) => {
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setItemQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const removeFromCart = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item._id !== itemId)); 
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
    const quantity = itemQuantities[element._id] || 1;
    const totalPrice = (element.price * quantity).toFixed(2);

    return (
      <Table.Tr key={element.id || i}>
        <Table.Td>
          <Trash size={20} 
            className='text-red-500 cursor-pointer hover:text-red-700' 
            onClick={() => removeFromCart(element._id)}/>
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
        <Table.Td>{element.brand}</Table.Td>
        <Table.Td>
          <div className='flex items-center justify-between bg-slate-200 p-1 rounded-md'>
            <Minus
              size={15} 
              onClick={() => quantity > 1 && updateQuantity(element?._id, quantity - 1)} 
              className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
            />
            <p className="min-w-[20px] text-center">{quantity}</p>
            <Plus 
              size={15} 
              onClick={() => updateQuantity(element?._id, quantity + 1)} 
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
    const quantity = itemQuantities[item._id] || 1;
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

const StepTwo = ({form}) => {
    
  return (
    <div className='w-2/3 mx-auto py-8'>
      <form  className="flex flex-col gap-4">
        <TextInput
        label="Payment method"
                   size="sm"
                              radius="sm"
                    placeholder="Payment method"
                     {...form.getInputProps("paymentMethod")}
                  />
                  <TextInput
                  label="Prep required"
                              size="sm"
                              radius="sm"
                              placeholder="Prep required"
                               {...form.getInputProps("prepRequired")}
                            />

                             <Radio.Group
                            
                            label="Ungetting Assistance"
                            {...form.getInputProps("assistance")}
      
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

const StepThree = ({form}) => {
   
    return(
         <div className='w-2/3 mx-auto py-8'>
      <form onSubmit={form.onSubmit(()=>console.log("hi"))} className="grid grid-cols-2 gap-4">
        <TextInput
        label="First name"
                    size="sm"
                              radius="sm"
                    placeholder="First name"
                     {...form.getInputProps("firstName")}
                  />
                  <TextInput
                  label="Last name"
                             size="sm"
                              radius="sm"
                              placeholder="Last name"
                               {...form.getInputProps("lastName")}
                            />
                  <TextInput
                  label="Email"
                              size="sm"
                              radius="sm"
                              placeholder="Email"
                               {...form.getInputProps("email")}
                            />
                  <TextInput
                  label="Phone number"
                             size="sm"
                              radius="sm"
                              placeholder="Phone number"
                               {...form.getInputProps("phone")}
                            />
                  <TextInput
                  label="Company"
                              size="sm"
                              radius="sm"
                              placeholder="Company"
                               {...form.getInputProps("company")}
                            />
                            <div className='grid grid-cols-2 gap-4'>

                  <TextInput
                  label="Market"
                  size="sm"
                              radius="sm"
                  placeholder="Market"
                  {...form.getInputProps("market")}
                  />
                  <TextInput
                  label="Storefront"
                  size="sm"
                              radius="sm"
                  placeholder="Storefront"
                  {...form.getInputProps("storeFront")}
                  />
                  </div>

                            
      </form>
    </div>
    )
}

const StepFour = ({form}) => {
    
    return(
         <div className='w-2/3 mx-auto py-8'>
      <form onSubmit={form.onSubmit(()=>console.log("hi"))} className="grid grid-cols-2 gap-4">
        <TextInput
        label="Street"
                    size="sm"
                              radius="sm"
                    placeholder="Street"
                     {...form.getInputProps("street")}
                  />
                  <TextInput
                  label="City"
                             size="sm"
                              radius="sm"
                              placeholder="City"
                               {...form.getInputProps("city")}
                            />
                  <TextInput
                  label="Zip/Postal Code"
                              size="sm"
                              radius="sm"
                              placeholder="Zip/Postal Code"
                               {...form.getInputProps("postalCode")}
                            />
                  <TextInput
                  label="State"
                             size="sm"
                              radius="sm"
                              placeholder="State"
                               {...form.getInputProps("state")}
                            />
                  <TextInput
                  label="Country"
                              size="sm"
                              radius="sm"
                              placeholder="Country"
                               {...form.getInputProps("country")}
                            />
                  
                         

                            
      </form>
    </div>
    )
}

const StepFive = ({ selectedItems, form, itemQuantities, setItemQuantities }) => {
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setItemQuantities(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  // Handle case where selectedItems is not available
  if (!selectedItems || selectedItems.length === 0) {
    return <div>No items selected for checkout.</div>;
  }

  const rows = selectedItems.map((element, i) => {
    const quantity = itemQuantities[element._id] || 1;
    const totalPrice = (element.price * quantity).toFixed(2);

    return (
      <Table.Tr key={element._id || i}>
        <Table.Td>
          <div className='flex items-center gap-3 line-clamp-1'>
            {element.name}
          </div>
        </Table.Td>
        <Table.Td>{element.brand}</Table.Td>
        <Table.Td>
          <div className='flex items-center justify-between bg-slate-200 p-1 rounded-md'>
            <Minus
              size={15} 
              onClick={() => quantity > 1 && updateQuantity(element?._id, quantity - 1)} 
              className='text-white bg-hollywood-700 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
            />
            <p className="min-w-[20px] text-center">{quantity}</p>
            <Plus 
              size={15} 
              onClick={() => updateQuantity(element?._id, quantity + 1)} 
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
    const quantity = itemQuantities[item._id] || 1;
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
              <Table.Th>Product Name</Table.Th>
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

                    <p>First name : {form?.values?.firstName} </p>
                    <p>Last name : {form?.values?.lastName} </p>
                    <p>Email : {form?.values?.email} </p>
                    <p>Phone : {form?.values?.phone} </p>
                    <p>Company : {form?.values?.company} </p>
                    <p>Market : {form?.values?.market} </p>

                </div>
            </div>
        
            <div>
                {/* client address */}
                <p className='border border-slate-200 rounded-t-lg py-2 px-3 bg-hollywood-700 text-white font-semibold'>Billing Address</p>
                <div className='grid grid-cols-2 gap-4 border border-t-0 py-2 px-3 rounded-b-lg border-slate-200 text-sm text-slate-600'>

                    <p>Steet Address : {form?.values?.street} </p>
                    <p>City : {form?.values?.city} </p>
                    <p>Zip/Postal Code : {form?.values?.postalCode} </p>
                    <p>State : {form?.values?.state} </p>
                    <p>Country : {form?.values?.country} </p>
                    

                </div>
            </div>

             <div>
                {/* prep */}
                <p className='border border-slate-200 rounded-t-lg py-2 px-3 bg-hollywood-700 text-white font-semibold'>Preference</p>
                <div className='grid grid-cols-2 gap-4 border border-t-0 py-2 px-3 rounded-b-lg border-slate-200 text-sm text-slate-600'>

                    <p>Payment Method : {form?.values?.paymentMethod} </p>
                    <p>Prep Required : {form?.values?.prepRequired} </p>
                    <p>Assistance : {form?.values?.assistance} </p>
                    

                </div>
            </div>

        </div>

    </div>

    <div className='text-end text-slate-600 mt-8'>
        <p>Total items : {selectedItems?.length}</p>
        <p>Tax : $10.89</p>
        <p className='text-xl font-semibold'>Total Price : ${(parseFloat(cartTotal) + 10.89).toFixed(2)} </p>
    </div>
    </div>
    )
}