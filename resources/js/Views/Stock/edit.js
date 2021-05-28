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
    const { params } = props.match;
    const [products,setProducts] = useState([]);
    const [stockTypes,setStockTypes] = useState([]);
    const [loading,setLoading] = useState(true);
    const [accounts,setAccounts] = useState([]);
    const [data,setData] = useState([]);

    useEffect(() => {
        axios.get(`/api/stock/${params.id}/edit `,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            if(res.data.success){
                setStockTypes(res.data.stockTypes);
                setProducts(res.data.products);
                setAccounts(res.data.accounts);
                setData(res.data.data);
                
                setLoading(false);
            }
            else 
            {
                swal(res.data.message);
            }
        })
        .catch(e => console.log(e)); 
    },[]);

    const changeStockType = (stockType) => {
        axios.post(`/api/stock/get-customer`,{stockType},{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setAccounts(res.data.customers);
        });
    };

    const handleSubmit = (values,{ resetForm,setSubmitting }) => {
        values['_method'] = "put";
        axios.post(`/api/stock/${data.id}`,{ ...values},{ 
            headers:{
                'Authorization':'Bearer '+ props.AuthStore.appState.user.access_token
            }  
        })
        .then((res) => {
            if(res.data.success){
                setSubmitting(false);
            }
            else 
            {
                
                setSubmitting(false);
            }
            swal(res.data.message);
        })
        .catch(e => setSubmitting(false));

    };

  
    if(loading) return <div>Yükleniyor</div>
 

    return (
        <Layout>
            <div className="mt-5">
            <div className="container">
            <Formik 
            initialValues={{
              stockType:data.stockType,
              customerId:data.customerId,
              productId:data.productId,
              quantity:data.quantity,
              totalPrice:data.totalPrice,
              date:data.date,
              note:data.note,
              isStock:data.isStock
            }}
            onSubmit={handleSubmit}
            validationSchema={
              Yup.object().shape({
               stockType:Yup.number().required('İşlem Seçimi Zorunludur'),
               productId:Yup.number().required('Ürün Seçimi Zorunludur'),
               quantity:Yup.number().required('Stok Adeti  Zorunludur'),
               totalPrice:Yup.number().required('Fiyat  Zorunludur'),
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
                            value={stockTypes.find(item => item.id == values.stockType)}
                            onChange={(e) => { changeStockType(e.id); setFieldValue('stockType',e.id) }}
                            placeholder={"İşlem Tipi seçiniz *"}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            options={stockTypes} />
                            
                        </div>
                        {(errors.stockType && touched.stockType) && <p className="form-error">{errors.stockType}</p>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <Select 
                            value={accounts.find(item => item.id == values.customerId)}
                            onChange={(e) => setFieldValue('customerId',e.id) }
                            placeholder={"Hesap seçiniz"}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            options={accounts} />
                            
                        </div>
                        {(errors.customerId && touched.customerId) && <p className="form-error">{errors.customerId}</p>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <Select 
                            value={products.find(item => item.id == values.productId)}
                            onChange={(e) => setFieldValue('productId',e.id) }
                            placeholder={"Ürün  seçiniz *"}
                            getOptionLabel={option => `${option.modelCode} - ${option.name}`}
                            getOptionValue={option => option.id}
                            options={products} />
                            
                        </div>
                        {(errors.productId && touched.productId) && <p className="form-error">{errors.productId}</p>}
                    </div>
                  </div> 
                  <div className="row">
                    <div className="col-md-6">
                        <CustomInput 
                            title="Ürün Stok Adeti *"
                            type="number"
                            value={values.quantity}
                            handleChange={handleChange('quantity')}
                        />
                        {(errors.quantity && touched.quantity) && <p className="form-error">{errors.quantity}</p>}
                    </div>
                    <div className="col-md-6">
                        <CustomInput 
                            title="Toplam Fiyat *"
                            type="number"
                            value={values.totalPrice}
                            handleChange={handleChange('totalPrice')}
                        />
                        {(errors.totalPrice && touched.totalPrice) && <p className="form-error">{errors.totalPrice}</p>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                        <CustomInput 
                            type="date"
                            value={values.date}
                            handleChange={handleChange('date')}
                        />
                        {(errors.date && touched.date) && <p className="form-error">{errors.date}</p>}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-12">
                        <input checked={values.isStock}  type="checkbox" onChange={handleChange('isStock')}/>
                        <label className="ml-1">Stoktağa yansıtılsın mı ?</label>
                    </div>
                  </div>
                  <div className="row mb-2">
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
            class="btn btn-lg btn-primary btn-block" 
            type="button">
              İşlemi Kaydet
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
   

