import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError/ValidationError';
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor(props){
    super(props);
    this.state = {
      nameValid: false,
      name: '',
      validationMessages: {
        name: '',
      }
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  validateName(fieldValue){
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;
  
    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0){
      fieldErrors.name = 'Name is required';
      hasError = true;
    }
    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid);
  }
  formValid(){
    this.setState({
      formValid: this.state.nameValid
    });
  }
  updateName(name){
    this.setState({name}, ()=>{this.validateName(name)});
  }
  

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error('folder added', { error })
      })
      
    }
  


  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <ValidationError hasError={!this.state.folderValid} message={this.state.validMessage}/>
            <input type='text' id='folder-name-input' name='folder-name' />
           
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

