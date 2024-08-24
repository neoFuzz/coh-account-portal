$.fn.dataTable.moment('MM/DD/YYYY');
let portal_url = '/';

$(function () {
    let dt = $('#account-list').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: `${portal_url}admin/list/account`, // URL to fetch data from server
            dataSrc: function (json) {
                return json.data;
            }
        },
        order: [[1, 'asc']],
        columns: [
            { data: 'uid' },
            { data: 'account_name' },
            { data: 'banned' },
            { data: 'ban_expiry' },
            { data: 'last_login' },
            { data: 'last_ip' },
            { data: 'inf' },
            { data: 'num_characters' },
            { data: 'active' },
            { data: 'online_time_this_session' },
            { data: 'online_time_total' },
            { data: 'button', searchable: false, orderable: false }
        ],
        columnDefs: [
            {
                targets: [3, 4, 5, 7],
                render: function (data) {
                    return data == null ? '-' : data;
                }
            },
            {
                targets: 6,
                render: function (data) {
                    if (data === null || data === undefined) {
                        return '-';
                    }
                    return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                }
            },
            {
                targets: [9, 10],
                width: 75,
                render: function (data) {
                    return data == null ? '-' : moment.duration(data, 'seconds').humanize();
                }
            },
            {
                targets: 11,
                render: function (data, type, row) {
                    return `<a href='${portal_url}admin/${row.uid}'><button>Open</button></a>`;
                }
            }
        ]
    });
});
