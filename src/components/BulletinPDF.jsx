// src/components/BulletinPDF.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Enregistrer une police (optionnel)
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf" }, // regular
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

// Créer les styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  ueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginBottom: 5,
  },
  ueName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  ueResult: {
    fontSize: 12,
    fontWeight: "bold",
  },
  courseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    paddingLeft: 10,
  },
  courseName: {
    fontSize: 10,
    width: "60%",
  },
  courseCode: {
    fontSize: 8,
    color: "#666",
  },
  courseGrade: {
    fontSize: 10,
    width: "20%",
    textAlign: "right",
  },
  courseCredits: {
    fontSize: 10,
    width: "20%",
    textAlign: "right",
  },
  summary: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 12,
  },
  decision: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  passed: {
    backgroundColor: "#e6ffed",
    color: "#22863a",
  },
  failed: {
    backgroundColor: "#ffeef0",
    color: "#cb2431",
  },
});

const BulletinPDF = ({ data }) => {
  const isAnnual = data.semester === "all";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>UNIVERSITÉ DE KINSHASA (UNIKIN)</Text>
          <Text style={styles.subtitle}>
            FACULTÉ DES SCIENCES - DÉPARTEMENT DE PHYSIQUE
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom de l'étudiant:</Text>
            <Text style={styles.infoValue}>
              {data.studentName} {data.studentPostName || ""}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Matricule:</Text>
            <Text style={styles.infoValue}>{data.studentIdNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Promotion:</Text>
            <Text style={styles.infoValue}>{data.promotion}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Période:</Text>
            <Text style={styles.infoValue}>
              {isAnnual ? "Année académique complète" : data.semester}
            </Text>
          </View>
        </View>

        {/* Résultats par UE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            RÉSULTATS PAR UNITÉ D'ENSEIGNEMENT
          </Text>

          {data.ueResults.map((ue) => (
            <View key={ue.ueId} style={{ marginBottom: 10 }}>
              <View style={styles.ueHeader}>
                <Text style={styles.ueName}>
                  {ue.ueName} ({ue.unitId}) - {ue.semester} - {ue.credits}{" "}
                  crédits
                </Text>
                <Text
                  style={{
                    ...styles.ueResult,
                    color: ue.isValid ? "#22863a" : "#cb2431",
                  }}
                >
                  {ue.average.toFixed(2)}/20 -{" "}
                  {ue.isValid ? "Validée" : "Non validée"}
                </Text>
              </View>

              {ue.courses.map((course) => (
                <View key={course.courseId} style={styles.courseRow}>
                  <View style={{ width: "60%" }}>
                    <Text style={styles.courseName}>{course.courseName}</Text>
                    <Text style={styles.courseCode}>{course.courseCode}</Text>
                  </View>
                  <Text
                    style={{
                      ...styles.courseGrade,
                      color: course.isValid ? "#22863a" : "#cb2431",
                    }}
                  >
                    {course.grade}/20
                  </Text>
                  <Text style={styles.courseCredits}>
                    {course.credits} crédits
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Résumé */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Moyenne Générale:</Text>
            <Text style={styles.summaryValue}>
              {data.generalAverage.toFixed(2)}/20
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Crédits Validés:</Text>
            <Text style={styles.summaryValue}>
              {data.validatedCredits}/{data.totalPossibleCredits}
            </Text>
          </View>

          {isAnnual && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Crédits Requis:</Text>
              <Text style={styles.summaryValue}>
                {Math.ceil(data.totalPossibleCredits * 0.75)} (75% du total)
              </Text>
            </View>
          )}
        </View>

        {/* Décision */}
        <View
          style={{
            ...styles.decision,
            ...(data.decision === "V" ? styles.passed : styles.failed),
          }}
        >
          <Text>
            DÉCISION: {data.decision === "V" ? "VALIDÉ" : "NON VALIDÉ"}
          </Text>
          <Text style={{ fontSize: 10, marginTop: 5 }}>
            {data.decision === "V"
              ? isAnnual
                ? "L'étudiant passe en année supérieure."
                : "L'étudiant valide le semestre."
              : isAnnual
              ? "L'étudiant ne valide pas son année et doit reprendre."
              : "L'étudiant ne valide pas le semestre."}
          </Text>
        </View>

        {/* Pied de page */}
        <View style={{ marginTop: 30, fontSize: 8, textAlign: "center" }}>
          <Text>Bulletin généré le {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BulletinPDF;
