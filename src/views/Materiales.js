import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import ButtonM from '../component/BtnAgregar.js';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';


const MaterialesView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  const [materiales, setMateriales] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    material: '',
    descripcion: '',
    estado: true,
  });
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewMaterial({
      material: '',
      descripcion: '',
      estado: true,
    });
    setSelectedMaterial(null);
  };


  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (materialId) => {
    const selected = materiales.find((material) => material._id === materialId);
    setSelectedMaterial(selected);
    setShowUpdateModal(true);
  };

  const url = 'https://apitammy-closset.fra1.zeabur.app/materiales';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMateriales(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (materialId) => {
    const selected = materiales.find((material) => material._id === materialId);
    setMaterialToDelete(selected);
    setShowDeleteConfirmationModal(true);
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = materiales.filter(
    (item) => item.material && item.material.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px',marginTop:'10px' }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);


  const handleCommonErrors = (statusCode) => {
    switch (statusCode) {
      case 401:
        toast.error('Su sesión ha caducado. Por favor, vuelva a iniciar sesión.');
        break;
      case 400:
        toast.error('Solicitud incorrecta');
        break;
      case 403:
        toast.error('Permisos insuficientes para la acción');
        break;
      default:
        toast.error('Error desconocido');
    }
  };
  
  const handleCreate = async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newMaterial),
      });
  
      if (response.ok) {
        toast.success('Material creado exitosamente');
        showData();
      } else {
        handleCommonErrors(response.status); 
        console.error('Error al intentar crear el material.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }
  
    handleClose();
  };
  
  const handleConfirmDelete = async (materialId) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`${url}/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
  
      if (response.ok) {
        toast.success('Material eliminado exitosamente');
        console.log(`Material con ID ${materialId} eliminado correctamente`);
        showData();
      } else {
        handleCommonErrors(response.status); 
        console.error(`Error al intentar eliminar el material con ID ${materialId}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setShowDeleteConfirmationModal(false);
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${selectedMaterial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedMaterial),
      });
  
      if (response.ok) {
        toast.success('Material actualizado exitosamente');
        console.log('Material actualizado exitosamente.');
        showData();
      } else {
        handleCommonErrors(response.status); 
        console.error('Error al intentar actualizar el material.');
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
    }
    handleClose();
  };

  useEffect(() => {
    showData();
  }, []);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4A2148',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  const columns = [
    {
      name: 'Material',
      selector: (row) => row.material,
      sortable: true,
      center: true,
    },
    {
      name: 'Descripcíon',
      selector: (row) => row.descripcion,
      sortable: true,
      center: true,
    },
    {
      name: 'Estado',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
      sortable: true,
      center: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <Styles.ActionButton onClick={() => handleUpdate(row._id)} update>
            Editar
          </Styles.ActionButton>
          <Styles.ActionButton onClick={() => handleDelete(row._id)}>
            Borrar
          </Styles.ActionButton>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <Styles.AppContainer>
      <Navbar/>
      <h2>
      <img
          src="https://fontmeme.com/permalink/241028/e6552f09ff62e950021a345e0a9a971a.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px' }}
        />
      </h2>
      <ButtonM variant="primary" onClick={handleShow}>
        Crear
      </ButtonM>

      <Styles.StyledDataTable
        columns={columns}
        customStyles={customStyles}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />

      <Styles.StyledModal show={showCreateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMaterial">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el material"
                value={newMaterial.material}
                onChange={(e) => setNewMaterial({ ...newMaterial, material: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newMaterial.descripcion}
                onChange={(e) => setNewMaterial({ ...newMaterial, descripcion: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    placeholder="Seleccione el estado">
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
</Form.Group>



          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
        <Button className="otros" variant="primary" onClick={handleCreate}>
            Guardar
          </Button>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
         
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMaterial">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el material"
                value={selectedMaterial ? selectedMaterial.material : ''}
                onChange={(e) =>
                  setSelectedMaterial({
                    ...selectedMaterial,
                    material: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedMaterial ? selectedMaterial.descripcion : ''}
                onChange={(e) =>
                  setSelectedMaterial({
                    ...selectedMaterial,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
            
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedMaterial ? (selectedMaterial.estado ? 'Activo' : 'Inactivo') : ''}
                onChange={(e) =>
                  setSelectedMaterial({
                    ...selectedMaterial,
                    estado: e.target.value === 'Activo',
                  })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
        <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
            Guardar cambios
          </Button>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        
        </Styles.ModalFooter>

      </Styles.StyledModal>

      <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>
        <Modal.Header style={{backgroundColor:'#4a4a4a',color:'white'}} closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>
          ¿Estás seguro de que deseas eliminar este material?
        </Modal.Body>
        <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}}>
          <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={() => handleConfirmDelete(materialToDelete._id)}>
            Sí
          </Button>
          <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default MaterialesView;

