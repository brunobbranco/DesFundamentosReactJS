import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    try {
      uploadedFiles.map(async file => {
        const data = new FormData();
        data.append('file', file.file, file.name);

        await api.post('/transactions/import', data);

        history.push('/');
      });
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): FileProps[] {
    const upFile: FileProps[] = [];
    files.map(singleFile =>
      upFile.push({
        file: singleFile,
        name: singleFile.name,
        readableSize: filesize(singleFile.size, { round: 0 }),
      }),
    );
    setUploadedFiles(upFile);

    return upFile;
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
