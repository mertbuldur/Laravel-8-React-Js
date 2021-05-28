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
import { difference } from 'lodash';
const Edit = (props) => {
    const { params } = props.match;
    const [loading,setLoading] = useState(true);
    const [category,setCategory] = useState({});
    
    useEffect(() => {
        axios.get(`/api/category/${params.id}/edit `,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            if(res.data.success){
                setCategory(res.data.category);
                setLoading(false);
            }
            else 
            {
                swal(res.data.message);
            }
        })
        .catch(e => console.log(e)); 
    },[]);



    const handleSubmit = (values,{ resetForm,setSubmitting }) => {
        const data = new FormData();
        data.append('name',values.name);
        data.append('_method','put')

        const config = {
            headers:{
                'Accept':'application/json',
                'content-type':'multipart/form-data',
                'Authorization':'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }
        axios.post(`/api/category/${category.id}`,data,config)
        .then((res) => {
            if(res.data.success){
                swal("İşlem Tamamladı");
                setSubmitting(false);
            }
            else 
            {
                swal(res.data.message);
                setSubmitting(false);
            }
        })
        .catch(e => console.log(e));

    };

    if(loading) return  <div>Yükleniyor</div>
    
  
    return (
        <Layout>
            <div className="mt-5">
            <div className="container">
            <Formik 
            initialValues={{
              name:category.name,
            }}
            onSubmit={handleSubmit}
            validationSchema={
              Yup.object().shape({
               name:Yup.string().required('Kategori Adı Zorunludur'),
               
            
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
                        <CustomInput 
                            title="Kategori Adı"
                            value={values.name}
                            handleChange={handleChange('name')}
                        />
                        {(errors.name && touched.name) && <p className="form-error">{errors.name}</p>}
                    </div>
                   
                  </div>
             
            

            <button 
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            class="btn btn-lg btn-primary btn-block" 
            type="button">
              Kategori Düzenle
              </button>
          </div>
              )}
          </Formik>
          </div>
          </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(Edit));