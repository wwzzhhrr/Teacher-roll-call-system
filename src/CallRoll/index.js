import {useNavigate, useParams} from "react-router-dom";
import React, {useState} from "react";
import useSWR from "swr";
import {Button, TabPane, Tabs, Typography} from "@douyinfe/semi-ui";
import {IconArrowLeft, IconEdit, IconFile} from "@douyinfe/semi-icons";
import styles from "./index.module.css";
import {CallRollTab} from "./callRollTab";
import {MakeGroupTab} from "./makeGroupTab";


function App() {
    const [isActive, setIsActive] = useState(false); //鼠标悬停变色
    const course = useParams().courseId
    const [changePointsButton, setChangePointsButton] = useState(false) //控制是否修改数据
    const [changeAttendance, setChangeAttendance] = useState(false)
    const {mutate} = useSWR(`http://localhost:4000/${course}`)
    const navigate = useNavigate()
    const {Title, Text} = Typography;
    const handleMouseDown = () => {
        setIsActive(true);
    };

    const handleMouseUp = () => {
        setIsActive(false);
    };

    const handleClick = () => {
        navigate("/Courses");
    };

    const handleChangeAttendance = ()=>{
        setChangeAttendance(false)
    }

    const style = {
        border: '0',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '0',
    };
    return (
        <>
            <header>
                <IconArrowLeft
                    className={`${isActive ? styles.active : ''}`}
                    onClick={() => {
                        handleClick()
                    }}
                    onMouseLeave={handleMouseUp}
                    onMouseEnter={handleMouseDown}
                />

                <Button
                    onClick={() => {
                    setChangePointsButton(!changePointsButton)
                    mutate()
                }} type="secondary"><IconEdit/>{changePointsButton ? '确认分数' : '修改分数'}</Button>

                <Button onClick={()=>{
                            setChangeAttendance(true)}}
                        type="secondary">
                    <IconFile />修改考勤
                </Button>

                <Title style={{margin: '8px 0'}}> {course} </Title>
            </header>
            <modal
                title="添加考勤"
                okText={'确认修改'}
                visible={changeAttendance}
                onOk={handleChangeAttendance}
                onCancel={()=>setChangeAttendance(false)}
                closeOnEsc={true}
                maskClosable={false}
                motion>

            </modal>
                <Tabs className={styles.Tabs} type="line">
                    <TabPane tab={'点名'} itemKey={'1'} >
                        <div className={styles.tabChild}>
                            <CallRollTab
                            course={course}
                            changePointsButton={changePointsButton}
                            />
                        </div>
                    </TabPane>

                    <TabPane tab={'分组'} itemKey={'2'}>
                        <div className={styles.tabChild}>
                            <MakeGroupTab course={course} changePointsButton={changePointsButton} />
                        </div>
                    </TabPane>
                </Tabs>
        </>
    )


}

export default App;