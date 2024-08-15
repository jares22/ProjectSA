import { useState, FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ConfirmationPage.module.css";

const checkEmployeeId = (employeeId: string) => {
  const validEmployeeIds = ["12345", "67890", "54321"]; // Example valid IDs
  return validEmployeeIds.includes(employeeId);
};

const ConfirmationPage: FunctionComponent = () => {
  const [code, setCode] = useState("");
  const [selectedRound, setSelectedRound] = useState("Round1");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRound(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 5) {
      if (checkEmployeeId(code)) {
        // No action needed for tickets at this stage
        navigate('/app', { replace: true });
      } else {
        setError("รหัสพนักงานไม่ถูกต้อง");
      }
    } else {
      setError("กรุณากรอกรหัส 5 ตัว");
    }
  };

  return (
    <div className={styles.confirmationContainer}>
      <h1 className={styles.confirmationTitle}>กรอกรหัสพนักงาน 5 ตัว</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={handleChange}
          maxLength={5}
          placeholder="กรอกรหัส 5 ตัว"
          className={styles.codeInput}
        />
        <div className={styles.roundSelection}>
          <label htmlFor="roundSelect" className={styles.roundLabel}>เลือกช่วงรอบรถ:</label>
          <select
            id="roundSelect"
            value={selectedRound}
            onChange={handleRoundChange}
            className={styles.roundSelect}
          >
            <option value="Round1">รอบรถ 1</option>
            <option value="Round2">รอบรถ 2</option>
            <option value="Round3">รอบรถ 3</option>
            {/* เพิ่มรอบรถเพิ่มเติมที่นี่ */}
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>
          ยืนยัน
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default ConfirmationPage;
