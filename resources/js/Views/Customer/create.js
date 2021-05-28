import { inject, observer } from 'mobx-react';
import React,{ useEffect,useState} from 'react';
import Layout from '../../Components/Layout/front.layout';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../Components/Form/CustomInput';
import Select from 'react-select';
import ImageUploader from 'react-images-upload';
import CKEditor from 'ckeditor4-react';
import swal from 'sweetalert';
import axios from 'axios';
const Create = (props) => {
  
    



    const handleSubmit = (values,{ resetForm,setSubmitting }) => {
       
       
        axios.post('/api/customer',{ ...values },{
            headers:{
                'Authorization':'Bearer '+ props.AuthStore.appState.user.access_token
            }
        })
        .then((res) => {
            if(res.data.success){
                resetForm({});
                swal(res.data.message);
                setSubmitting(false);
            }
            else 
            {
                swal(res.data.message);
                setSubmitting(false);
            }
        })
        .catch(e => { setSubmitting(false); console.log(e) });

    };


    return (
        <Layout>
            <div className="mt-5">
            <div className="container">
            <Formik 
            initialValues={{
              customerType:'',
              name:'',
              email:'',
              phone:'',
              address:'',
              note:'',
            }}
            onSubmit={handleSubmit}
            validationSchema={
              Yup.object().shape({
               customerType:Yup.number().required('Hesap Seçimi Zorunludur'),
               name:Yup.string().required('Hesap Adı Zorunludur'),
               email:Yup.string().email().required('Ürün Model Kodu Zorunludur'),
               phone:Yup.string().required('Telefon Zorunludur'),

              })
            }
            >
              {({ 
                values,
                handleChange,
                handleSubmit,
                handleBlur,
                errors,
                isValid,
                isSubmitting,
                setFieldValue,
                touched
              }) => ( 
              <div>
                 
                  <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <Select 
                            onChange={(e) => setFieldValue('customerType',e.id) }
                            placeholder={"Hesap Tipi seçiniz *"}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            options={[{ id:0,name:'Tedarikçi'},{id:1,name:'Müşteri'}]} />
                            
                        </div>
                        {(errors.customerType && touched.customerType) && <p className="form-error">{errors.customerType}</p>}
                    </div>
                  </div> 
                  <div className="row">
                    <div className="col-md-6">
                        <CustomInput 
                            title="Hesap Adı *"
                            value={values.name}
                            handleChange={handleChange('name')}
                        />
                        {(errors.name && touched.name) && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div className="col-md-6">
                        <CustomInput 
                            title="Email *"
                            value={values.email}
                            handleChange={handleChange('email')}
                        />
                        {(errors.email && touched.email) && <p className="form-error">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-6">
                        <CustomInput 
                            title="Telefon *"
                            value={values.phone}
                            handleChange={handleChange('phone')}
                        />
                        {(errors.phone && touched.phone) && <p className="form-error">{errors.phone}</p>}
                    </div>
                    <div className="col-md-6">
                        <CustomInput 
                            title="Adres"
                            value={values.address}
                            handleChange={handleChange('address')}
                        />
                        {(errors.address && touched.address) && <p className="form-error">{errors.address}</p>}
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12">
                        <CKEditor
                            data={values.note}
                            onChange={(event) => {
                                const data = event.editor.getData();
                                setFieldValue('note',data);
                            }}
                        />
                        </div>
                  </div>
             

            

            <button 
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            className="btn btn-lg btn-primary btn-block mt-2" 
            type="button">
              Hesap Ekle
              </button>
          </div>
              )}
          </Formik>
          </div>
          </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(Create));