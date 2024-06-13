import { Table, Avatar } from '@douyinfe/semi-ui';
import React, { useEffect, useMemo } from 'react';
import http from '../http';

export function pointTable({ courseId }) {
  const processData = data => {
    const formatDate = personData => {
      const date = new Date(personData.date);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${personData.session ? '上午' : '下午'}`;
    };
    const columns = [
      {
        title: '学生',
        dataIndex: 'name',
        fixed: true,
      },
    ];

    const dates = [
      ...new Set(
        data.map(item => {
          return formatDate(item);
        }),
      ),
    ];
    dates.forEach(date => {
      columns.push({
        title: date,
        dataIndex: date,
      });
    });

    columns.push({
      title: '总分',
      dataIndex: 'score',
      fixed: 'right',
    });

    // Create data
    const processedData = data.map((item, index) => {
      const dateKey = formatDate(item);
      return {
        key: (index + 1).toString(),
        name: item.name,
        [dateKey]: item.score > 0 ? `+${item.score}` : `${item.score}`,
        score: item.score > 0 ? `+${item.score}` : `${item.score}`,
      };
    });

    return { columns, data: processedData };
  };

  const [columns, setColumns] = React.useState();
  const [data, setData] = React.useState();
  const scroll = useMemo(() => ({ y: 750, x: 1200 }), []);
  useEffect(() => {
    http.get(`/score/courses/${courseId}`).then(res => {
      const { columns, data } = processData(res.data);
      console.log(columns, data);
      setColumns(columns);
      setData(data);
    });
  }, []);
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={scroll}
      />
    </>
  );
}
