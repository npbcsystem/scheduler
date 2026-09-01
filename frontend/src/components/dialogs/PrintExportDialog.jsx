import { useState } from "react";

import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import {
  exportSchedule,
} from "../../services/scheduleService";

export default function PrintExportDialog({
  open,
  onClose,
  month,
  year,
}) {
  const [week, setWeek] =
    useState("ALL");

  const [pdf, setPdf] =
    useState(true);

  const [excel, setExcel] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const monthName =
    new Date(
      year,
      month - 1,
      1
    ).toLocaleString(
      "en-US",
      {
        month: "long",
      }
    );

  const downloadFile = (
    blob,
    extension
  ) => {
    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `NPBC-Schedule-${year}-${month}-${week}.${extension}`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url
    );
  };

  const handleExport =
    async () => {
      try {
        setError("");

        if (!pdf && !excel) {
          setError(
            "Please select PDF, Excel, or both."
          );

          return;
        }

        setLoading(true);

        if (pdf) {
          const pdfBlob =
            await exportSchedule(
              week,
              month,
              year,
              "pdf"
            );

          downloadFile(
            pdfBlob,
            "pdf"
          );
        }

        if (excel) {
          const excelBlob =
            await exportSchedule(
              week,
              month,
              year,
              "excel"
            );

          downloadFile(
            excelBlob,
            "xlsx"
          );
        }

        onClose();
      } catch (err) {
        console.error(
          "EXPORT ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to export schedule."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Print / Export Schedule
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          sx={{ mt: 1 }}
        >
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Typography
            fontWeight="bold"
          >
            {monthName} {year}
          </Typography>

          <div>
            <Typography
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Select Period
            </Typography>

            <RadioGroup
              value={week}
              onChange={(e) =>
                setWeek(
                  e.target.value
                )
              }
            >
              <FormControlLabel
                value="1"
                control={
                  <Radio />
                }
                label="Week 1"
              />

              <FormControlLabel
                value="2"
                control={
                  <Radio />
                }
                label="Week 2"
              />

              <FormControlLabel
                value="3"
                control={
                  <Radio />
                }
                label="Week 3"
              />

              <FormControlLabel
                value="4"
                control={
                  <Radio />
                }
                label="Week 4"
              />

              <FormControlLabel
                value="5"
                control={
                  <Radio />
                }
                label="Week 5"
              />

              <FormControlLabel
                value="ALL"
                control={
                  <Radio />
                }
                label="Entire Month"
              />
            </RadioGroup>
          </div>

          <div>
            <Typography
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Export Format
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={pdf}
                  onChange={(e) =>
                    setPdf(
                      e.target.checked
                    )
                  }
                />
              }
              label="PDF"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={excel}
                  onChange={(e) =>
                    setExcel(
                      e.target.checked
                    )
                  }
                />
              }
              label="Excel"
            />
          </div>

          <Alert severity="info">
            PDF is formatted for
            printing. Excel contains
            the detailed schedule and
            a summary sheet.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleExport}
          disabled={
            loading ||
            (!pdf && !excel)
          }
        >
          {loading ? (
            <>
              <CircularProgress
                size={20}
                color="inherit"
                sx={{
                  mr: 1,
                }}
              />

              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}