import React, { Component } from 'react';
import axios from 'axios';
import '../css/ConfigView.css';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ConfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      nombre_negocio: '',
      direccion: '',
      correo_electronico: '',
      telefono_1: '',
      telefono_2: '',
      eslogan: '',
      tipo_de_cambio_dolar: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.state.isEditing) {
      this.fetchData();
    }
  }

  fetchData() {
    axios.get('https://apitammy-closset.fra1.zeabur.app/api/configuracion')
      .then(response => {
        const configData = response.data.data[0];

        this.setState({
          id: configData._id,
          nombre_negocio: configData.nombre_negocio || '',
          direccion: configData.direccion || '',
          correo_electronico: configData.correo_electronico || '',
          telefono_1: configData.telefono_1 || '',
          telefono_2: configData.telefono_2 || '',
          eslogan: configData.eslogan || '',
          tipo_de_cambio_dolar: configData.tipo_de_cambio_dolar || '',
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleEditClick = () => {
    this.setState({ isEditing: true }, () => {
      this.fetchData();
    });
  };

  handleSaveClick = () => {
    const { id, nombre_negocio, direccion, correo_electronico, telefono_1, telefono_2, eslogan, tipo_de_cambio_dolar } = this.state;

    const newData = {
      nombre_negocio,
      direccion,
      correo_electronico,
      telefono_1,
      telefono_2,
      eslogan,
      tipo_de_cambio_dolar,
    };

    axios.put(`https://apitammy-closset.fra1.zeabur.app/api/configuracion/${id}`, newData)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        this.setState({ isEditing: false });
        toast.success('Cambios guardados correctamente' );
      })
      .catch(error => {
        toast.error('Complete todos los campos', );
        console.error('Error updating data:', error);
        toast.error('Error al guardar cambios');
      });
  };


  render() {
    return (
      <div className="config-container" style={{backgroundColor:'#219ebc'}}  >
        <Navbar />
        <h2> <img
          src="https://fontmeme.com/permalink/241028/6d6e0deb66181f3a02843b0da91df39d.png"
          alt="fuentes-de-comics"
          border="0"
          style={{ width: '85%', height: 'auto', maxWidth: '900px',margin:'0 auto' }}
        /></h2>
        <div className="config-grid">
          <form className="config-form">
            <div className="config-column">
              <label style={{fontSize:'35px',color:'black'}} htmlFor="nombre_negocio">Nombre del Negocio</label>
              <input 
                type="text"
                id="nombre_negocio"
                name="nombre_negocio"
                value={this.state.isEditing ? this.state.nombre_negocio : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'35px',color:'black'}} className="campos" htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={this.state.isEditing ? this.state.direccion : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'35px',color:'black',borderRadius:'5px'}} className="campos" htmlFor="correo_electronico">Correo Electrónico</label>
              <input
                type="text"
                id="correo_electronico"
                name="correo_electronico"
                value={this.state.isEditing ? this.state.correo_electronico : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'35px',color:'black'}} className="campos" htmlFor="telefono_1">Teléfono Claro</label>
              <input
                type="text"
                id="telefono_1"
                name="telefono_1"
                value={this.state.isEditing ? this.state.telefono_1 : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />
            </div>

            <div className="config-column">
              <label style={{fontSize:'35px',color:'black'}} className="campos" htmlFor="telefono_2">Teléfono Tigo</label>
              <input
                type="text"
                id="telefono_2"
                name="telefono_2"
                value={this.state.isEditing ? this.state.telefono_2 : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'35px',color:'black'}} htmlFor="eslogan">Eslogan</label>
              <input
                type="text"
                id="eslogan"
                name="eslogan"
                value={this.state.isEditing ? this.state.eslogan : ''}
                className="config-input campos"
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                readOnly={!this.state.isEditing}
                onChange={this.handleChange}
              />

              <label style={{fontSize:'35px',color:'black'}} className='etiqueta' htmlFor="tipo_de_cambio_dolar">Tipo de Cambio </label>
              <input
                type="text"
                id="tipo_de_cambio_dolar"
                name="tipo_de_cambio_dolar"
                value={this.state.isEditing ? this.state.tipo_de_cambio_dolar : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
                style={{textAlign:'center',fontSize:'20px',borderRadius:'5px'}}
                onChange={this.handleChange}
              />
            </div>
          </form>
        </div>
        <button type="button" style={{backgroundColor:'green'}} className="config-button" onClick={this.handleSaveClick} disabled={!this.state.isEditing}>
          Guardar
        </button>
        <button type="button" style={{backgroundColor:'red'}} className="edit-button" onClick={this.handleEditClick} disabled={this.state.isEditing}>
          Editar
        </button>
        <Footer />
        <ToastContainer />
      </div>
    );
  }
}

export default ConfigView;
