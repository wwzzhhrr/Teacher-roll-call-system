import React, { useState, useEffect } from 'react';
import { List, Descriptions, Button, Modal } from '@douyinfe/semi-ui';
import axios from "axios";

function App(){
    const [students, setStudents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [randomStudent, setRandomStudent] = useState()
    const [randomStudentPoints, setRandomStudentPoints] = useState()

    useEffect(()=>{
        axios.get('http://localhost:4000/students')
            .then(response => {
                console.log(response.data); // 输出获取到的学生信息
                setStudents(response.data)

            })
            .catch(error => {
                console.error(error); // 输出错误信息
            })
    }, []);

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        margin: '8px 2px',
    };

    function callName(){
        setModalOpen(true)
        let numStudents = students.length;
        let numStudentsChose = Math.floor(Math.random()*numStudents)
        setRandomStudent(students[numStudentsChose]['name'])
        setRandomStudentPoints(students[numStudentsChose]['points'])
    }
    function plusPoints(){
        setModalOpen(false)
    }
    function minusPoints(){
        setModalOpen(false)
    }
    return (
        <div>
            <List
                grid={{
                    gutter: 12,
                    xs: 0,
                    sm: 0,
                    md: 12,
                    lg: 8,
                    xl: 8,
                    xxl: 6,
                }}
                dataSource={students}
                renderItem={item => (
                    <List.Item style={style}>
                        <div>
                            <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.name}</h3>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[
                                    {key: '分数', value: item.points}
                                ]}
                            />
                        </div>
                    </List.Item>
                )}
            />
            <Button theme='solid' type='primary' style={{ marginRight: 8 }} onClick={callName}>随机点名</Button>
            <Modal
                title="幸运儿"
                visible={modalOpen}
                footerFill={true}
                onOk={plusPoints}
                onCancel={minusPoints}
                okText={'加分!'}
                cancelText={'答错了'}
                motion
            >
                {randomStudent}
                <br/>
                {randomStudentPoints}
            </Modal>
        </div>
    );


}

export default App;