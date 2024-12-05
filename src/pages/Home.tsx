import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import bg from "../assets/images/bg3.png";
import { MenuSticky } from "../components";
import { firebaseAuth } from "../firebase";
import { useStaffs } from "../hooks";
// import { signOut } from "firebase/auth";

export const InnerHome = () => {
  const { staffs, loading } = useStaffs();

  const currentStaff = useMemo(() => {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    return staffs.find((staff) => staff.email === user.email);
  }, [staffs]);

  // const handleLogout = () => {
  //   signOut(firebaseAuth).then(() => {
  //     window.location.reload();
  //   });
  // };

  return (
    <div
      className="home-page"
      style={{
        display: "flex",
        position: "relative",
        placeItems: "center",
        height: "100vh",
        width: "100vw",
        background: `url('${bg}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: "#fff",
        justifyContent: "center",
      }}
    >
      {/* <MenuSticky /> */}
      {/* <span
        style={{
          color: "#ffffffc2",
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 1000,
        }}
        onClick={handleLogout}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -0.5 25 25"
          width={50}
          height={50}
          fill="#fff"
        >
          <path
            d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"
            fill="#ffffffc2"
          />
        </svg>
      </span> */}
      <MenuSticky />
      <img
        src={bg}
        style={{
          minHeight: "100%",
          maxWidth: "100%",
          filter: !loading ? "unset" : "blur(8px)",
          objectFit: "cover",
        }}
      />
      <div style={{ width: "100%", textAlign: "center", position: "absolute" }}>
        <>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 22 }}>Xin chào</div>
            <div
              style={{
                fontSize: 24,
              }}
            >
              {currentStaff?.name || currentStaff?.email || ""}
            </div>
          </div>
          <div style={{ marginBottom: 108 }}>Mã số may mắn của bạn</div>
          {
            <div style={{ fontWeight: "bold", fontSize: 80 }}>
              {/* <span
                      style={{
                        fontFamily: 'math',
                        fontWeight: 'lighter',
                        lineHeight: '50px',
                        fontSize: 120,
                      }}
                    >
                      &infin;
                    </span> */}
              {currentStaff?.luckyNumber || "????"}
            </div>
          }
        </>
      </div>
    </div>
  );
};

export const Home = () => {
  return isMobile ? (
    <InnerHome />
  ) : (
    <div
      style={{
        display: "flex",
        placeItems: "center",
        minHeight: "100vh",
        padding: "0 12px",
        justifyContent: "center",
      }}
    >
      <MenuSticky />
      Vui lòng mở chế độ điện thoại
    </div>
  );
};
