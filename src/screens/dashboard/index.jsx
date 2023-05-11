import "./style.css"
import Sidebar from "../../components/sidebar2"
import { Paper, Box, Avatar } from "@mui/material"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AvatarDrop from "../../components/avatar"
import Searchbar from "../../components/autocomplete"
import Card from "../../components/card"
import CardStats from "../../components/cardStats"




const App = () => {



    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 50,
        lineHeight: '50px',
    }));


    const PaperLeft = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: "100%",
        lineHeight: '100%',
    }));



    return (
        <div className="dashboard_main_parent">
            <Sidebar />


            <div className="right_side_main">

                <span className="search_bar_top">

                    <Searchbar />


                    <span className="search_bar_right_bar">


                        <Avatar sx={{ bgcolor: "orange", width: 30, height: 30, fontSize: "medium" }}>M</Avatar>
                        <Avatar sx={{ bgcolor: "pink", width: 30, height: 30, fontSize: "medium" }}>F</Avatar>
                        <Avatar sx={{ bgcolor: "gray", width: 30, height: 30, fontSize: "medium" }}>N</Avatar>

                        <Box
                            sx={{
                                display: 'flex',
                                '& > :not(style)': {
                                    m: 1,
                                    width: "15rem",

                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    paddingLeft: "0rem",
                                    paddingRight: "1rem",
                                    borderRadius: "9px",
                                    gap: "1rem"
                                },
                            }}
                        >

                            <Item elevation={3}>
                                {/* {`elevation=${6}`} */}
                                <AvatarDrop />
                                {/* <Avatar sx={{ bgcolor: "orange", width: 30, height: 30, fontSize: "medium" }}>N</Avatar> */}
                                <span className="sidebar_text"> Lina Tade </span>
                            </Item>




                        </Box>



                    </span>

                </span>

                <span className="heading_row">
                    <span className="main_heading_dashboard">Overview</span>
                    <span className="heading_bar_right">
                        <span className="sidebar_text">Activities</span>
                        <span style={{ fontSize: "15px", color: "gray" }} className="sidebar_text">See all</span>
                    </span>
                </span>


                <span className="dashboard_grid_base">

                    <span className="grid_left_base">

                        <span className="grid_left_upper">
                            <CardStats />
                            <CardStats />
                            <CardStats />
                            <Card grid="25" />
                            <Card grid="2524" />

                        </span>

                        <span className="grid_left_lower">
                            <Card />
                            <Card />
                            <Card />
                            <Card />

                        </span>

                    </span>


                    <span className="grid_right_base">


                        <Card time />
                        <Card time />
                        <Card time />


                    </span>

                </span>

                {/* <Box
                    sx={{
                        display: 'flex',
                        '& > :not(style)': {
                            m: 1,
                            width: "20rem",
                            height: "20rem",
                        },
                    }}
                >

                    <Item className="white_box_base" elevation={6}>
                        {`elevation=${6}`}
                    </Item>


                </Box> */}

            </div>


        </div>
    )

}



export default App