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
        axios.get(`/api/customer`,{
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
                    item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.phone && item.phone.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.email && item.email.toLowerCase().includes(filterText.toLowerCase()) 
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
                axios.delete(`/api/customer/${item.id}`,{
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
                                        name: 'Hesap Tipi',
                                        selector:'customerTypeString',
                                        sortable:true
                                    },
                                    {
                                        name: 'Adı',
                                        selector:'name',
                                        sortable:true
                                    },
                                    {
                                        name: 'Telefon',
                                        selector:'phone',
                                        sortable:true
                                    },
                                    {
                                        name: 'Email',
                                        selector:'email',
                                        sortable:true
                                    },
                                    {
                                        name:'Düzenle',
                                        cell:(item) => <button onClick={() => props.history.push(({
                                            pathname: `/musteri/duzenle/${item.id}`
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
                            subHeaderComponent={<SubHeaderComponent filter={filterItem} action ={{ class:'btn btn-success',uri:() => props.history.push('/musteri/ekle'),title:'Yeni Hesap Ekle'}} />}
                        />
                    </div>
                </div>
            </div>
            
        </Layout>
    )
};
export default inject("AuthStore")(observer(Index));