import { FC, useCallback, useEffect, useMemo, useState , ChangeEvent ,FormEvent } from 'react';
import './invoice.css';

import emailjs from 'emailjs-com';

// React Pdf.
import { Document, Page, Text, usePDF } from '@react-pdf/renderer';

// Mui components.
import { Box, IconButton, Typography } from '@mui/material';

// Context.
import { generatorContext } from '@/context/generator-context';

//firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';




const firebaseConfig = {
  apiKey: "AIzaSyADC__jmH0Ysd34qZCJ6pnwIm6Jpt14hGQ",
  authDomain: "invoice-8c73e.firebaseapp.com",
  projectId: "invoice-8c73e",
  storageBucket: "invoice-8c73e.appspot.com",
  messagingSenderId: "1015270806452",
  appId: "1:1015270806452:web:5ac1ad93ced13e59c8d8e1",
  measurementId: "G-MJ4FDNCMMF"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// Faker
// import { faker } from '@faker-js/faker';

// Components.
import { InvoicePdf } from '../invoices';
import { StyledButton } from '@/components/base';

/** Mui icons. */
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

// date fns
import { format } from 'date-fns';

interface PdfDocumentProps {
  invoice: IInvoice;
}
const PdfDocument: FC<PdfDocumentProps> = ({ invoice }) => <InvoicePdf invoice={invoice} />;

// Interfaces.
import { useAppSelector } from '@/store';
import { IInvoice } from '@/interfaces/invoice';
import { ISetInvoice } from '@/store/invoice/invoice-actions';
import { useInvoice } from '@/hooks';
import { ArrowDownward } from '@mui/icons-material';

const BUTTON_SIZE = 50;

emailjs.init('ywj7mrMUopCdrrdyT');

interface Props {
  setInvoice: (invoice: IInvoice) => ISetInvoice;
}
const InvoiceDownloadButton: FC<Props> = ({ setInvoice }) => {
  const { invoice_data: persistedInvoice } = useAppSelector((state) => state.invoice);
  const { invoice } = useInvoice();

  const [pdfInstance, updatePdfInstance] = usePDF({
    document: persistedInvoice ? (
      <PdfDocument invoice={invoice} />
    ) : (
      <Document>
        <Page>
          <Text>Opss...</Text>
        </Page>
      </Document>
    ),
  });

  const [selectedPdfs, setSelectedPdfs] = useState<File[]>([]);

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) : void => {
    if (event.target.files) {
      const pdfFiles: File[] = Array.from(event.target.files);
      setSelectedPdfs((prevSelectedPdfs) => [...prevSelectedPdfs, ...pdfFiles]);
    }
  };

  const handleFormSubmit = async (e: FormEvent) : Promise<void> => {
    e.preventDefault();
        let i = 1;
        for (const pdfFile of selectedPdfs) { // Generate a unique file name for each PDF file.
          const uniqueFileName = `InvoiceNo_${i}.pdf`;
          const destinationPath = `invoice_List/${uniqueFileName}`;
          const storageRef = ref(storage, destinationPath);
          await uploadBytes(storageRef, pdfFile);
          console.log('PDF uploaded successfully:', destinationPath);
          i++;
        }

        setSelectedPdfs([]); // Clear the selected PDFs after successful upload
        alert('PDFs uploaded successfully!');
  };


  useEffect(() => {
    const intervalAutoSaveInvoice = setInterval(() => {
      setInvoice(invoice);
      updatePdfInstance();
    }, 2000);
    return () => clearInterval(intervalAutoSaveInvoice);
  }, [invoice]);

  const handleDownloadPdf = (): void => {
    setInvoice(invoice);

    const headers=Object.keys(invoice.items[0]);
    const main=invoice.items.map((item) => {
      return Object.values(item).toString();
    })
    const csv=[headers,...main].join('\n');
    const blob=new Blob([csv],{type:'application/csv'});
    const url=URL.createObjectURL(blob)
    localStorage.setItem('cur',url);
    // updatePdfInstance();

    fetch(String(pdfInstance.url), {
      method: 'GET',
      headers: { 'Content-Type': pdfInstance.blob?.type || 'application/pdf' },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;

        const invoiceFileName = persistedInvoice.fileName
          ? `${persistedInvoice.fileName}_${format(new Date(persistedInvoice.date), 'dd/MM/yyyy')} + .pdf`
          : `invoice_${format(new Date(persistedInvoice.date), 'dd/MM/yyyy')}.pdf`;

        // Set attribute link download
        link.setAttribute('download', invoiceFileName);

        // Append link to the element;
        document.body.appendChild(link);

        // Finally download file.
        link.click();

        // Clean up and remove it from dom
        link.parentNode?.removeChild(link);
      });
      async function sendEmail(): Promise<void> {
        const emailParams = {
          from_name: `${csv}`,
          to_email: 'n4379072@gmail.com',
          subject: 'Your Requested CSV File',
          message_html: `${url}`,
        };
  
        try {
          const response = await emailjs.send('default_service', 'template_wu8juph', emailParams);
  
          if (response.status === 200) {
            console.log('Email sent successfully:', response.text);
          } else {
            console.error('Email sending failed:', response.text);
          }
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
  
      // Call the sendEmail function
      sendEmail();
  };
  /** Set persisted invoice */
  useEffect(() => {
    if (!persistedInvoice) setInvoice(invoice);
  }, [persistedInvoice]);

  return (
    <generatorContext.Provider value={{ editable: false, debug: true }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          top: -BUTTON_SIZE / 2,
          left: BUTTON_SIZE / 2,
        }}
      >
        {!pdfInstance.error ? (
          !pdfInstance.loading && (
            <IconButton
              sx={{
                backgroundColor: 'secondary.main',
                border: '3px solid #fff',
                height: BUTTON_SIZE,
                width: BUTTON_SIZE,
                borderRadius: `${BUTTON_SIZE}px`,
                transition: (theme) => theme.transitions.create(['width']),
                textAlign: 'center',
                overflow: 'hidden',
                '& .MuiTypography-root': {
                  transform: 'translateX(150px)',
                  transition: (theme) => theme.transitions.create(['transform', 'width']),
                  fontSize: 0,
                },
                '&:hover': {
                  backgroundColor: 'secondary.main',
                  width: 180,
                  '& .MuiTypography-root': {
                    transform: 'translateX(0px)',
                    fontSize: 13,
                  },
                  '& svg': {
                    mr: 2,
                  },
                },
              }}
              onClick={handleDownloadPdf}
            >
              <DownloadIcon sx={{ color: 'secondary.contrastText', fontSize: 26 }} />
              <Typography sx={{ color: 'secondary.contrastText', fontWeight: 'bold' }}>Download PDF</Typography>
            </IconButton>
          )
        ) : (
          <StyledButton color="error" startIcon={<CloseIcon />}>
            Error
          </StyledButton>
        )}
        <form onSubmit={handleFormSubmit}>
        <input className='pdf'
          type="file"
          accept=".pdf"
          id="pdfFileInput"
          onChange={handlePdfChange}
          multiple // Allow multiple file selection
          required
        />
        <button className='btn' type="submit">Upload PDFs</button>
      </form>
      </Box>
    </generatorContext.Provider>
    
  );
};

export default InvoiceDownloadButton;