import { inject, observer } from 'mobx-react';
import React,{ useEffect , useState} from 'react';
import Layout from '../../Components/Layout/front.layout';
import DataTable from 'react-data-table-component';
import SubHeaderComponent from '../../Components/Form/SubHeaderComponent';
import ExpandedComponent from '../../Components/Form/ExpandedComponent';
import swal from 'sweetalert';
const Index = (props) => {
    const [data,setData] = useState([]);
    const [refresh,setRefresh] = useState(false);
    const [filter,setFilter] = useState({
        filteredData:[],
        text:'',
        isFilter:false
    });

    useEffect(() => {
        axios.get(`/api/stock`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
           setData(res.data.data);
        })
        .catch(e => console.log(e)); 
    },[refresh]);

    const filterItem = (e) => {
        const filterText = e.target.value;
        if(filterText != '')
        {
            const filteredItems = data.filter(
                (item) => (
                    item.totalPrice && String(item.totalPrice).toLowerCase().includes(filterText.toLowerCase()) ||
                    item.quantity && String(item.quantity).toLowerCase().includes(filterText.toLowerCase()) ||
                    (item.customer && item.customer.name.toLowerCase().includes(filterText.toLowerCase())) ||
                    (item.product && item.product.name.toLowerCase().includes(filterText.toLowerCase())) ||
                    (item.product && item.product.modelCode.toLowerCase().includes(filterText.toLowerCase()))
                    
                    
                )
            );

            setFilter({
                filteredData:filteredItems,
                text:filterText,
                isFilter:true
            })
        }
        else 
        {
            setFilter({
                filteredData:[],
                text:'',
                isFilter:false
            })
        }
    };
    const deleteItem = (item) => {
        swal({
            title:'Silmek istediğine emin misin ?',
            text:'Silinince veriler geri gelmicektir',
            icon:'warning',
            buttons:true,
            dangerMode:true
        })
        .then((willDelete) => {
            if(willDelete){
                axios.delete(`/api/stock/${item.id}`,{
                    headers:{
                        Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
                    }
                }).then((res) => {
                    if(res.data.success){
                        setRefresh(true);
                    }
                    else
                    {
                        swal(res.data.message);
                    }
                })
                .catch(e => console.log(e));
            }   
        })
    }
   

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <DataTable 
                            columns={
                                [
                                    {
                                        name: 'İşlem Tipi',
                                        selector:'stockTypeString',
                                        sortable:true
                                    },
                                    {
                                        name: 'Hesap',
                                        selector:(row, index) => {return row.customer ? row.customer.name : "Hesap Yok"},
                                        sortable:true
                                    },
                                    {
                                        name: 'Ürün',
                                        selector:'product.name',
                                        sortable:true
                                    },
                                    {
                                        name: 'Adet',
                                        selector:'quantity',
                                        sortable:true
                                    },
                                    {
                                        name: 'Fiyat',
                                        selector:'totalPrice',
                                        sortable:true
                                    },
                                    {
                                        name: 'Tarih',
                                        selector:'date',
                                        sortable:true
                                    },
                                    {
                                        name:'Düzenle',
                                        cell:(item) => <button onClick={() => props.history.push(({
                                            pathname: `/stok/duzenle/${item.id}`
                                        }))} className={"btn btn-primary"}>Düzenle</button>
                                    },
                                    {
                                        name:'Sil',
                                        cell:(item) => <button onClick={() => deleteItem(item)}  className={"btn btn-danger"}>Sil</button>,
                                        button:true
                                    }
                                ]
                            }
                            subHeader={true}
                            responsive={true}
                            hover={true}
                            fixedHeader
                            pagination
                            expandableRows
                            expandableRowsComponent={<ExpandedComponent field={"note"}/>}
                            data={(filter.isFilter) ? filter.filteredData : data}
                            subHeaderComponent={<SubHeaderComponent filter={filterItem} action ={{ class:'btn btn-success',uri:() => props.history.push('/stok/ekle'),title:'Yeni Stok İşlemi Ekle'}} />}
                        />
                    </div>
                </div>
            </div>
            
        </Layout>
    )
};
export default inject("AuthStore")(observer(Index));