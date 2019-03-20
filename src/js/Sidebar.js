import React, { Component } from 'react';
import user2 from '../img/user2-160x160.jpg'

export default class Sidebar extends Component {
    render() {
        return (

            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu" data-widget="tree">
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-files-o"></i>
                                <span>Tăng trưởng kinh tế</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li><a href="#"><i className="fa fa-circle-o"></i> Tăng trưởng GDP</a></li>
                                <li><a href="#"><i className="fa fa-circle-o"></i> Ngoại thương</a></li>
                                <li><a href="#"><i className="fa fa-circle-o"></i> Đầu tư</a></li>
                                <li><a href="#"><i className="fa fa-circle-o"></i> Tiêu dùng và du lịch</a></li>
                                <li><a href="#"><i className="fa fa-circle-o"></i> Chất lượng tăng trưởng</a></li>
                                <li><a href="#"><i className="fa fa-circle-o"></i> Xem tất cả tăng trưởng kinh tế</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="pages/widgets.html">
                                <i className="fa fa-th"></i> <span>Ổn định kinh tế vĩ mô</span>
                            </a>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-pie-chart"></i>
                                <span>Tài chính công</span>
                            </a>
                        </li>
                        <li>
                            <ul className="treeview-menu">
                                <li><a href="pages/tables/simple.html"><i className="fa fa-circle-o"></i> Simple tables</a></li>
                                <li><a href="pages/tables/data.html"><i className="fa fa-circle-o"></i> Data tables</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="pages/calendar.html">
                                <i className="fa fa-calendar"></i> <span>Môi trường kinh doanh</span>
                            </a>
                        </li>
                        <li>
                            <a href="pages/mailbox/mailbox.html">
                                <i className="fa fa-envelope"></i> <span>Bộ máy hành chính</span>
                            </a>
                        </li>
                        <li>
                            <a href="pages/mailbox/mailbox.html">
                                <i className="fa fa-envelope"></i> <span>Lao động việc làm</span>
                            </a>
                        </li>
                        <li>
                            <a href="pages/mailbox/mailbox.html">
                                <i className="fa fa-envelope"></i> <span>Các vấn đề xã hội</span>
                            </a>
                        </li>
                        <li>
                            <a href="pages/mailbox/mailbox.html">
                                <i className="fa fa-envelope"></i> <span>Môi trường</span>
                            </a>
                        </li>
                        <li>
                            <a href="pages/mailbox/mailbox.html">
                                <i className="fa fa-envelope"></i> <span>Cơ cấu hạ tầng và KHCN</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}