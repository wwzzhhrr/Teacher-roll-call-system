import { Table, Avatar } from '@douyinfe/semi-ui';
import React, { useEffect } from 'react';
import http from '../http';

export function attendanceModal({ courseId, status, session }) {
  function transformData(data) {
    return data.map((item, index) => {
      const sessionText = session[item.session];
      const statusText = status[item.status];
      const updateTime =
        new Date(item.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) + ` ${sessionText}`;
      return {
        key: index,
        updateTime: updateTime,
        student: item.name,
        state: statusText,
      };
    });
  }
  const [specialAttendance, setSpecialAttendance] = React.useState([]);
  useEffect(() => {
    http.get(`attendance/courses/${courseId}`).then(res => {
      setSpecialAttendance(transformData(res.data));
      console.log(res.data);
      console.log(transformData(res.data));
    });
  }, []);

  const columns = [
    {
      title: '时间',
      dataIndex: 'updateTime',
    },
    {
      title: '姓名',
      dataIndex: 'student',
    },
    {
      title: '详情',
      dataIndex: 'state',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={specialAttendance}
        pagination={false}
      />
    </>
  );
}
