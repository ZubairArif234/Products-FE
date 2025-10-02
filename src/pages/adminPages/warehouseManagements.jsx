import { useEffect, useMemo, useState } from 'react';
import { Button, Table, TextInput, Modal, Loader, Group, ActionIcon, Divider, Pagination, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { SquarePen, Trash, Plus, Search, Eye } from 'lucide-react';
import { useWarehouse } from '../../hooks/useWarehouse';
import custAxios, { attachToken } from '../../configs/axios.config';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const WarehouseManagements = () => {
  const [filters, setFilters] = useState({ page: 1, limit: PAGE_SIZE, title: '' });
  const { warehouse, isPending, refetch } = useWarehouse(filters);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const onView = (row) => {
    navigate(`/admin/warehouse-details`,{state:{warehouse:row}});
  }

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

  useEffect(() => {
    // refetch when filters change if backend supports params
    refetch?.();
  }, [filters.page, filters.limit, filters.title]);

  const isBusy = isPending || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="py-5 px-2">
      <div className='flex items-center justify-between'>
        <div>
           <p className="font-bold text-hollywood-700 text-lg">Warehouse</p>
         
          {/* <p className='text-3xl mb-1'>Warehouses</p>
          <p className='text-sm text-slate-500'>Manage your warehouses</p> */}
        </div>
        <Button onClick={onAdd} leftSection={<Plus size={16}/>} className='!bg-hollywood-700 !text-white !rounded-lg'>Add warehouse</Button>
      </div>
      {/* <Divider my={20}/> */}

      <div className='bg-white '>
        {/* <div className='flex justify-between items-center mb-3'>
          <TextInput placeholder='Search warehouse' value={filters.title} onChange={(e) => handleSearch(e.target.value)} leftSection={<Search size={18}/>} />
        </div> */}

        {isBusy ? (
          <div className='my-16 flex justify-center'><Loader color="#255b7f"/></div>
        ) : warehouses.length > 0 ? (
          <>
            <Table.ScrollContainer minWidth={700} type="native">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Country</Table.Th>
                    <Table.Th>City</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {warehouses.map((w) => (
                    <Table.Tr key={w._id}>
                      <Table.Td className='capitalize'>{w.name}</Table.Td>
                      <Table.Td className='max-w-[300px]'>
                        <span className='line-clamp-2'>{w.description}</span>
                      </Table.Td>
                      <Table.Td>{w.country}</Table.Td>
                      <Table.Td>{w.city}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="Edit">
                            <ActionIcon variant='light' color='blue' onClick={() => onEdit(w)}>
                              <SquarePen size={16}/>
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="View">
                            <ActionIcon variant='light' color='green' onClick={() => onView(w)}>
                              <Eye size={16}/>
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <ActionIcon variant='light' color='red' onClick={() => onDelete(w)}>
                              <Trash size={16}/>
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <div className='flex justify-end mt-4'>
              <Pagination color='#255b7f' total={totalPages} value={filters.page} onChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
            </div>
          </>
        ) : (
          <div className='my-16 text-center'>
            <p className='text-lg font-semibold'>No warehouses found</p>
            <p className='text-sm text-slate-500'>Try adjusting your search or add a new one.</p>
          </div>
        )}
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

export default WarehouseManagements;


