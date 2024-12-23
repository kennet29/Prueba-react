import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import { FaTrash,FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import ButtonM from '../component/BtnAgregar.js';

const MarcasView = () => {
    const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null,
  });
  
  const [marcas, setMarcas] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newMarca, setNewMarca] = useState({
    marca: '',
    estado: '',
    descripcion: '',
  });
  const [selectedMarca, setSelectedMarca] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewMarca({
      marca: '',
      estado: '',
      descripcion: '',
    });
    setSelectedMarca(null);
  };

  const handleShow = () => setShowCreateModal(true);
  const handleUpdate = (marcaId) => {
    const selected = marcas.find((marca) => marca._id === marcaId);
    setSelectedMarca(selected);
    setShowUpdateModal(true);
  };

  const url = 'https://apitammy-closset.fra1.zeabur.app/api/marcas';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (marcaId) => {
    const selected = marcas.find((marca) => marca._id === marcaId);
    setSelectedMarca(selected);
    setShowDeleteConfirmation(true);
  };

  const filteredItems = marcas.filter(
    (item) => item.marca && item.marca.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px',marginTop:'10px' }}>
        <input
          type="text"
          placeholder="Buscar..."
          className='text-center'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCommonErrors = (statusCode) => {
    switch (statusCode) {
      case 401:
        toast.error('Su sesión ha caducado. Por favor, vuelva a iniciar sesión.' );
        break;
      case 400:
        toast.error('Solicitud incorrecta' );
        break;
      case 403:
        toast.error('Permisos insuficientes para la acción' );
        break;
      default:
        toast.error('Error desconocido' );
    }
  };


  const handleCreate = async () => {
    const token = Cookies.get('token');
    try {
      console.log('JSON que se envía en la creación:', JSON.stringify(newMarca)); 
      const newMarcaToSend = {
        ...newMarca,
        estado: newMarca.estado === 'Activo',
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
        body: JSON.stringify(newMarcaToSend),
      });
  
      if (response.ok) {
        toast.success('Marca creada exitosamente');
        console.log('Marca creada exitosamente.');
        showData();
      } else {
        handleCommonErrors(response.status); 
        toast.error('Error al intentar crear la marca.');
      }
    } catch (error) {
      toast.error('Error en la solicitud de creación:', error);

    }
  
    handleClose();
  };
  
  const handleDeleteConfirmed = async (marcaId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${url}/${marcaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
      });
  
      if (response.ok) {
        toast.success('Material eliminado exitosamente' );
        showData(); 
      } else {
        handleCommonErrors(response.status); 
      }
    } catch (error) {
    }
  };
  
  const handleUpdateSubmit = async () => {
    try {
      const token = Cookies.get('token');
    
      const selectedMarcaToSend = {
        ...selectedMarca,
        estado: selectedMarca.estado === 'Activo',
      };
  
      const response = await fetch(`${url}/${selectedMarca._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, 
        },
        body: JSON.stringify(selectedMarcaToSend),
      });
  
      if (response.ok) {
        toast.success('Marca actualizado exitosamente', );
        showData();
      } else {
        handleCommonErrors(response.status); 
        console.error('Error al intentar actualizar la marca.');
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


  const columns  = [
  
    {
      name: 'Marca',
      selector: (row) => row.marca,
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
      name: 'Descripcion',
      selector: (row) => row.descripcion,
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
      <Navbar />
      <h2>
      <img
          src="https://fontmeme.com/permalink/241028/3576f4d42dc1a25a16aaaedf4141c68b.png"
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
          <Modal.Title>Crear Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMarca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la marca"
                value={newMarca.marca}
                onChange={(e) => setNewMarca({ ...newMarca, marca: e.target.value })}
              />
            </Form.Group>


            <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={newMarca.estado}
    onChange={(e) => setNewMarca({ ...newMarca, estado: e.target.value })}
  >
    <option value="">Seleccionar Estado</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </Form.Control>
</Form.Group>



            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newMarca.descripcion}
                onChange={(e) => setNewMarca({ ...newMarca, descripcion: e.target.value })}
              />
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
          <Modal.Title>Actualizar Marca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMarca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la marca"
                value={selectedMarca ? selectedMarca.marca : ''}
                onChange={(e) =>
                  setSelectedMarca({
                    ...selectedMarca,
                    marca: e.target.value,
                  })
                }
              />
            </Form.Group>


           <Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedMarca ? selectedMarca.estado : ''}
    onChange={(e) =>
      setSelectedMarca({
        ...selectedMarca,
        estado: e.target.value,
      })
    }
  >
    <option value="">Seleccionar Estado</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </Form.Control>
</Form.Group>



            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedMarca ? selectedMarca.descripcion : ''}
                onChange={(e) =>
                  setSelectedMarca({
                    ...selectedMarca,
                    descripcion: e.target.value,
                  })
                }
              />
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

      <Modal  show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
  <Modal.Header   closeButton  style={{backgroundColor:'#4a4a4a',color:'white'}}>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>
    ¿Estás seguro de que deseas eliminar esta marca?
  </Modal.Body>
  <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}}>
    <Button variant="danger" style={{ width: '100px', height: '50px' }} onClick={() => {
      handleDeleteConfirmed(selectedMarca._id);
      setShowDeleteConfirmation(false);
    }}>
      Si
    </Button>
    <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
      Cancelar
    </Button>
  </Modal.Footer>
</Modal>


      <Footer/> 
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default MarcasView;
