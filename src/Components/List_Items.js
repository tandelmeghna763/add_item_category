import { Button, Modal, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { IoBagAdd } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import './Style.css';


const CustomTable = ({ Items, type = null, Droup = null, deleteitm, editcategory, editItems }) => {

    return (

        <>
            <table className='tb'>
                <thead>
                    <tr>
                        <th>{type}_id</th>
                        <th>{type}_Name</th>
                        {type === "Item" ? <th>Category_name</th> : null}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Items?.map((i) => {
                        return (
                            <tr>
                                <td>{i.id}</td>
                                <td>{i.name}</td>
                                {type === "Item" ? <td>{i.category_name}</td> : null}
                                {type === "Item" ? <td><MdEdit onClick={() => editItems(i)} size={20} /><MdDelete onClick={() => { deleteitm(i.id) }} color='red' size={20}></MdDelete></td>
                                    : <td><MdEdit onClick={() => editcategory(i)}></MdEdit></td>}

                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </>

    );
}
const App = () => {

    const [Value, setValue] = useState()
    const [List, setList] = useState([])
    const [Items, setItems] = useState([])
    const [Droup, setDroup] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemModel, setItemModel] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    const [filteredItem, setFilterItem] = useState([]);
    const [currenttab, setCurrenttab] = useState(1)

    useEffect(() => {
        const savedList = JSON.parse(localStorage.getItem('List')) || [];
        const savedItems = JSON.parse(localStorage.getItem('Items')) || [];
        setList(savedList);
        setItems(savedItems);
    }, []);

    const Filter = (e) => {
        setSearch(e.target.value);
        console.log('sarch', typeof currenttab, e.target.value)
        if (currenttab == 1) {
            let serchlist = ([...List])
            let newlist = serchlist.filter((ele) => ele.name?.toLowerCase().includes(search.toLowerCase()))
            setFilteredList([...newlist])
        } else if (currenttab == 2) {
            let searchitems1 = ([...Items])
            let newitems = searchitems1.filter((ele) => ele.name?.toLowerCase().includes(search))
            setFilterItem([...newitems])
        }
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        if (Value === "") {
            return setValue("")
        }
        else {
            let record = { id: uuidv4(), name: Value }
            setList([...List, { ...record }])
            setValue('')
            setIsModalOpen(false);
            localStorage.setItem("List", JSON.stringify([...List, { ...record }]))
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showItem = () => {
        setItemModel(true);

    }
    const ItemOk = () => {
        console.log('Droup', Droup)
        if (Value === "") {
            return setValue("")
        }
        else {
            let record = { id: uuidv4(), name: Value, category_name: Droup }
            setItems([...Items, { ...record }])
            setValue('')
            setItemModel(false);
            localStorage.setItem("Items", JSON.stringify([...Items, { ...record }]))
        }
    };

    const ItemCancel = () => {
        setItemModel(false);
    };
    const deleteitm = (id = null) => {
        let temp = [...Items]
        const result = temp.filter((dlt) => dlt.id !== id);
        setItems(result)
    }

    const editcategory = (cat) => {
        let temp = [...List]
        let edit = prompt("edit category", cat?.name)
        alert(`Edit value ${edit}`)
        const newMsgs = temp.map((msg) => {
            if (msg.id === cat?.id)
                msg = { id: cat?.id, name: edit, }
            return msg
        })
        console.log('new list', newMsgs)
        setList(newMsgs)
    }
    const editItems = (itm) => {
        let temp1 = [...Items]
        let edit = prompt("edit value", itm?.name)
        alert(`Edit Items ${edit}`)
        const newitm = temp1.map((msg) => {
            if (msg.id === itm?.id)
                msg = { ...itm, name: edit, }
            return msg
        })
        setItems(newitm)
    }

    const column = [
        {
            key: '1',
            label: 'Category',
            children: <CustomTable Items={filteredList.length > 0 ? filteredList : List} type="Category" editcategory={editcategory} />, //table component
        },
        {
            key: '2',
            label: 'Items',
            children: <CustomTable Items={filteredItem.length > 0 ? filteredItem : Items} type="Item" Droup={Droup} deleteitm={deleteitm} editItems={editItems} />,
        },


    ];

    const changeTab = (activeKey) => {
        // console.log(activeKey);
        setCurrenttab(activeKey);
    };
    return (

        <div>

            <div className="button-group">
                <IoBagAdd size={30} style={{ marginRight: "10px" }} />
                <h2 style={{ marginRight: "900px" }}>Add Item Category</h2>
                <Button type="primary" onClick={showModal} style={{ backgroundColor: "GrayText", width: "100px" }}>
                    + Category
                </Button>
                <Button type="primary" onClick={showItem} style={{ backgroundColor: "GrayText", width: "100px" }}>
                    + Item
                </Button>
            </div>
            <div className='search'>
                <input type='text' placeholder='Search...' onChange={Filter} value={search}></input>
            </div>

            <Modal title="Add Category" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                Name<input type='text' value={Value} placeholder='Type of Category Name' onChange={(e) => setValue(e.target.value)} className='cat'></input>
            </Modal>
            <Modal title="Add Item" open={itemModel} onOk={ItemOk} onCancel={ItemCancel}>

                Name<input type='text' value={Value} placeholder='Enter Item Name' onChange={(e) => setValue(e.target.value)} className='itm'></input><br></br>
                <label style={{ marginRight: "20px" }}>Select Category name</label>
                <select value={Droup} onChange={(e) => setDroup(e.target.value)} style={{ width: "100px", height: "20px", marginTop: "10px" }}>

                    {List?.map((i) => (
                        <option selected="selected">{i.name}</option>

                    ))}

                </select>

            </Modal>

            <Tabs defaultActiveKey={currenttab} items={column} onChange={(activeKey) => changeTab(activeKey)} />

        </div>
    );
};

export default App;

