import { useNavigate, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import useSWR from 'swr';
import { Button, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';
import { IconArrowLeft, IconEdit, IconFile } from '@douyinfe/semi-icons';
import styles from './index.module.css';
import { CallRollTab } from './callRollTab';
import { MakeGroupTab } from './makeGroupTab';
import { LeaveIcon as Leave } from '../atoms/index';

function App() {
  const course = useParams().courseId;
  const [changePointsButton, setChangePointsButton] = useState(false); //控制是否修改数据
  const [changeAttendance, setChangeAttendance] = useState(false);
  const { mutate } = useSWR(`http://localhost:4000/${course}`);
  const { Title, Text } = Typography;

  const handleChangeAttendance = () => {
    setChangeAttendance(false);
  };
  return (
    <>
      <header>
        <Leave path={`/CourseDetails/${course}`} />

        <Button
          onClick={() => {
            setChangePointsButton(!changePointsButton);
            mutate();
          }}
          type="secondary"
        >
          <IconEdit />
          {changePointsButton ? '确认分数' : '修改分数'}
        </Button>

        <Button
          onClick={() => {
            setChangeAttendance(true);
          }}
          type="secondary"
        >
          <IconFile />
          修改考勤
        </Button>

        <Title style={{ margin: '8px 0' }}> {course} </Title>
      </header>
      <modal
        title="添加考勤"
        okText={'确认修改'}
        visible={changeAttendance}
        onOk={handleChangeAttendance}
        onCancel={() => setChangeAttendance(false)}
        closeOnEsc={true}
        maskClosable={false}
        motion
      ></modal>
      <Tabs className={styles.Tabs} type="line">
        <TabPane tab={'点名'} itemKey={'1'}>
          <div className={styles.tabChild}>
            <CallRollTab
              course={course}
              changePointsButton={changePointsButton}
            />
          </div>
        </TabPane>

        <TabPane tab={'分组'} itemKey={'2'}>
          <div className={styles.tabChild}>
            <MakeGroupTab
              course={course}
              changePointsButton={changePointsButton}
            />
          </div>
        </TabPane>
      </Tabs>
    </>
  );
}

export default App;
