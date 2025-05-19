import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div>
      <div className={"w-[95%] 800px:w-[92%] m-auto py-2 text-black dark:text-white px-3"}>
        <h1 className={`${styles.title} !text-start pt-2`}>
          Platform Terms and Condition
        </h1>
      <ul style={{ listStyle: "unset", marginLeft: "15px" }}>
      <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          EduHub is committed to maintaining a secure, respectful, and enriching environment for all its users, including students, instructors, and administrators. Our policies are designed to protect your rights, ensure the responsible use of the platform, and maintain the highest standards of educational integrity and data protection.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          At EduHub, we take your privacy seriously. We collect only the necessary personal information required for platform functionality, such as name, email address, and profile details. This data is used solely to manage your account, track course progress, facilitate communication, and deliver platform features effectively. We use modern security measures including JWT-based authentication, encrypted data storage, and secure APIs to protect your personal information. Additionally, we may use third-party services like OAuth providers and media storage tools (e.g., Cloudinary), but your data is never sold or shared irresponsibly.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          We expect all users to conduct themselves in a respectful and professional manner. Any form of harassment, abuse, hate speech, or discriminatory behavior is strictly prohibited and may result in account suspension or termination. Users should also refrain from uploading or submitting plagiarized content. EduHub promotes academic honesty, and all content—whether instructional or participatory—must be original or appropriately credited. Misuse of community features such as course reviews, Q&A forums, or discussion boards for spam, promotion, or irrelevant content will not be tolerated.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Content on EduHub is subject to moderation. Instructors are responsible for ensuring their course materials are accurate, relevant, and respectful. Learner contributions, such as forum posts or comments, must also maintain the integrity of the learning environment. EduHub reserves the right to remove any content that violates these guidelines.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Refunds are offered under specific conditions to ensure fairness. Users may request a refund within a limited period after course purchase, typically within seven days, provided a significant portion of the course has not already been completed. Requests must be submitted to the support team along with valid reasoning and proof of purchase. Refund approvals are handled on a case-by-case basis.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Users are expected to maintain the security of their accounts. Sharing login credentials, creating duplicate or fake accounts, or attempting to exploit the platform in any way is strictly prohibited. EduHub reserves the right to suspend or terminate any account that violates these terms. We also ensure that all financial transactions conducted through EduHub are processed securely via trusted payment gateways. Upon completion of each purchase, users receive digital invoices. Any applicable taxes are calculated based on regional requirements and shown at checkout.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          EduHub reserves the right to revise these policies periodically to reflect changes in technology, legal requirements, or platform enhancements. Users will be notified of significant updates, and continued use of the platform signifies agreement with the revised policies.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          If you have any questions, concerns, or require further clarification regarding any of our policies, please feel free to contact our support team at support@eduhub.com or visit our official website at www.eduhub.com.
        </p>
      </ul>
      </div>
    </div>
  );
};

export default Policy;
