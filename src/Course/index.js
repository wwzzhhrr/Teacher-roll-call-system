import {Students} from "../CallRoll/components";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { LeaveIcon as Leave } from "../atoms/index";
import {Button, List, Input, RadioGroup, Modal, Radio, Card, SideSheet, Table, Avatar} from "@douyinfe/semi-ui";
import React, {useState} from "react";
import {IconFile} from "@douyinfe/semi-icons";
import { attendanceModal as AttendanceList } from "./attendance";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";


function Course(){

    const course = useParams().courseId
    const [isAdd, setIsAdd] = useState(false);
    const [newStudent, setNewStudent] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isVisibleSideSheet, setIsVisibleSideSheet] = useState(false);
    const [isAttendance, setIsAttendance] = useState(false);
    const [studentStateList, setStudentStateList] = useState({});  //学生状态表
    const [remark, setRemark] = useState([]);
    const [value, setValue] = useState(1)
    const navigate = useNavigate()
    const {data: students, mutate} = useSWR(`http://localhost:4000/${course}`, url =>
        axios.get(url)
            .then(res => res.data))
    const change =()=>{
        setIsVisibleSideSheet(false)
    }
    const handleCancel =()=>{
        setIsAttendance(false)
    }
    const handleOk = ()=>{
        setIsAttendance(false)
    }
    const changeState =(e, name)=>{
        // console.log(name, e);
        console.log(name, e.target.value);
        setValue(e.target.value)
    }
    return(
        <>
            <Leave
                path={"/Courses"}/>
            <Modal
                visible={isAttendance}
                title="添加考勤"
                motion={true}
                okText="确认"
                maskClosable={false}
                closeOnEsc={true}
                onOk={handleOk}
                onCancel={handleCancel}>
                <List
                    dataSource={students}
                    renderItem={item => (
                        <List.Item
                            header={<Avatar color={"blue"}>{item.name}</Avatar>}
                            main={
                                <div>
                                    <RadioGroup type='button' buttonSize='large' mode="advanced" onChange={(e)=>{changeState(e, item.name)}}>
                                        <Radio value={1}>迟到</Radio>
                                        <Radio value={2}>请假</Radio>
                                        <Radio value={3}>缺席</Radio>
                                    </RadioGroup>
                                    <Input prefix="备注：" showClear></Input>
                                </div>
                            }
                        />
                    )}
                />
            </Modal>
            <Modal
                visible={isAdd}
                title="添加学生"
                motion={true}
                okText="添加"
                onCancel={()=>setIsAdd(false)}
                onOk={()=>{
                    console.log(newStudent)
                    setIsAdd(false)}}
                maskClosable={false}
                closeOnEsc={true}>
                <Input placeholder="学生名称" onChange={text=>{setNewStudent(text)}}></Input>
            </Modal>
            <Button
                onClick={()=>{setIsAdd(true)}}>添加学生</Button>
            <Button
                onClick={()=>{
                    setIsDelete(!isDelete)}}
                type={isDelete ? "danger" : "primary"}
            >{isDelete ? "确认修改" : "编辑学生" }</Button>
            <Students
                students={students}
                isGroup={true}
                isDelete={isDelete}
                changePointsButton={false}
                course={course}/>

            <Card
                title=''
            >
                {"上课"}<Button onClick={()=>{navigate(`/callRoll/${course}`)}}>进入课程{course}</Button>
            </Card>

            <Card
                title=''
            >
                {"考勤"}<Button onClick={()=>(setIsVisibleSideSheet(!isVisibleSideSheet))}>进入考勤{course}</Button>
            </Card>

            <Card
                title=''
            >
                {"统计"}<Button></Button>
            </Card>

            <SideSheet title="考勤" visible={isVisibleSideSheet} onCancel={change} size={'large'}>
                今日考勤<Button onClick={()=>setIsAttendance(!isAttendance)}><IconFile/>添加考勤</Button>
                <AttendanceList/>
            </SideSheet>
        </>
    )
}

export default Course