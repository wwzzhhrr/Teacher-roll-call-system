import React, { useState } from 'react';
import useSWR from 'swr';
import { Button, Card, InputNumber, List, Typography } from '@douyinfe/semi-ui';
import _ from 'lodash';
import styles from './index.module.css';
import { Students } from './components';

export function MakeGroupTab({ course, changePointsButton }) {
  const [groupNum, setGroupNum] = useState(2); //小组人员数量
  const [isShowGroup, setIsShowGroup] = useState(false);
  const [groupOfStudents, setGroupOfStudents] = useState([]);
  const [cardColor, setCardColor] = useState([
    'blue',
    'red',
    'pink',
    'purple',
    'light-blue',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'light-green',
    'amber',
    'orange',
  ]);
  const { data: students } = useSWR(`http://localhost:4000/${course}`);
  const { Text, Title } = Typography;

  function makeGroup() {
    setCardColor(_.shuffle(cardColor));
    let studentsArray = [];
    for (let i of students) {
      studentsArray.push(i['name']);
    }
    studentsArray = _.shuffle(studentsArray);
    studentsArray = _.chunk(studentsArray, groupNum);
    if (studentsArray[studentsArray.length - 1].length === 1) {
      studentsArray[0].unshift(studentsArray[studentsArray.length - 1][0]);
      studentsArray.pop();
    }
    setGroupOfStudents(studentsArray);
    setIsShowGroup(true);
  }

  return (
    <div>
      <Students
        students={students}
        isGroup={true}
        changePointsButton={changePointsButton}
        course={course}
      />
      <div className={styles.makeGroup}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Title>每组人数：</Title>
          <InputNumber
            min={2}
            max={6}
            step={1}
            defaultValue={2}
            onChange={num => {
              setGroupNum(num);
            }}
          />
        </div>
        <Button
          theme="solid"
          type="primary"
          style={{ marginRight: 8 }}
          onClick={makeGroup}
        >
          随机分组
        </Button>
      </div>
      <Title>分组结果</Title>
      {isShowGroup ? (
        <List
          type="flex"
          grid={{
            gutter: [16, 8],
            span: 6,
          }}
          className={styles.groupList}
          dataSource={groupOfStudents}
          renderItem={item => (
            <List.Item>
              <Card
                className={styles.cards}
                style={{
                  border: 'none',
                  borderRadius: '12px',
                }}
                headerStyle={{
                  backgroundColor: `rgba(var(--semi-${cardColor[groupOfStudents.indexOf(item)]}-4), 0.65)`,
                }}
                header={
                  <Title
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >{`${String.fromCharCode(groupOfStudents.indexOf(item) + 97)}组`}</Title>
                }
              >
                <List
                  className={styles.group}
                  dataSource={item}
                  renderItem={itemName => (
                    <List.Item
                      className={styles.nameCards}
                      style={{
                        border: `2px solid rgba(var(--semi-${cardColor[groupOfStudents.indexOf(item)]}-4), 0.65)`,
                        padding: '10px',
                      }}
                    >
                      <Text
                        style={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        {itemName}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        ''
      )}
    </div>
  );
}
