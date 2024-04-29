import React, { useState, useEffect } from 'react';
import { Spin, List, Descriptions, Button, Modal ,InputNumber } from '@douyinfe/semi-ui';
import axios from "axios";
import useSWR from "swr";


function App(){
    const [modalOpen, setModalOpen] = useState(false);
    const [randomStudent, setRandomStudent] = useState()
    const [randomStudentPoints, setRandomStudentPoints] = useState()
    const [numStudentsChoose, setNumStudentsChoose] = useState()
    const { data: students, error, isLoading, mutate } = useSWR("http://localhost:4000/students", url=>
        axios.get(url).then(res=>res.data))

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        margin: '8px 2px',
    };

    function callName() {
        let numStudents = students.length;
        console.log(numStudents)
        for(let i=0; i<numStudents; i++){
            if(!students[i]['isCall']){

                break
            }
            if(i===(numStudents-1)){
                for(let j=0; j<numStudents; j++){
                    fetch(`http://localhost:4000/students/${j}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ isCall: false }), // 将 points 设置为一个数值
                    })
                }
            }
        }

        setModalOpen(true);

        let randomNum = Math.floor(Math.random() * numStudents);
        while(students[randomNum]['isCall']){
            randomNum = Math.floor(Math.random() * numStudents);
        }
        fetch(`http://localhost:4000/students/${randomNum}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isCall: true }), // 将 points 设置为一个数值
        })
        setNumStudentsChoose(randomNum);
        setRandomStudent(students[randomNum]['name']);
        setRandomStudentPoints(students[randomNum]['points']);
    }

    function changePoints() {
        setModalOpen(false);
        console.log('1111')
        const selectedStudent = students[numStudentsChoose]
        // console.log(changeScoreValue)

        fetch(`http://localhost:4000/students/${numStudentsChoose}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: selectedStudent.points + 1 }), // 将 points 设置为一个数值
        })
            .then(response => response.json())
            .then(data => {console.log(data)
                mutate('http://localhost:4000/students')});
    }
    function closeModal(){
        setModalOpen(false);
    }
    return (
        <div>
            {Array.isArray(students) ? (
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
                                <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{ item.isCall ? '😇' : ''}{item.name}</h3>
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
            ) : (
                <Spin />
            )}
            <Button theme='solid' type='primary' style={{ marginRight: 8 }} onClick={callName}>随机点名</Button>
            <Modal
                title="幸运儿"
                visible={modalOpen}
                footerFill={true}
                onOk={changePoints}
                onCancel={closeModal}
                okText={'加分!'}
                cancelText={'答错了'}
                motion
            >
                {randomStudent}
                <br/>
                当前分数：{randomStudentPoints}分
                {/*<InputNumber min={1} max={10} defaultValue={1} onchange={newValue=>{setChangeScoreValue(newValue)}}/>*/}
            </Modal>
        </div>
    );


}

export default App;