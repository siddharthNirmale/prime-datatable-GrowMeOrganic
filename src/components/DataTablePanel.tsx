import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { fetchArtworks } from '../services/api';
import type { Artwork } from '../types';

const DataTablePanel = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRowsMap, setSelectedRowsMap] = useState<Map<number, Artwork>>(new Map());
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(12);
  const [bulkCount, setBulkCount] = useState(0);
  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  const loadPage = async (page: number) => {
    setLoading(true);
    const { data, total } = await fetchArtworks(page + 1);
    setArtworks(data);
    setTotalRecords(total);
    setLoading(false);
  };

  const onPageChange = (e: any) => {
    setPage(e.page);
    setRows(e.rows);
  };

  const isRowSelected = (row: Artwork) => selectedRowsMap.has(row.id);

  const toggleRow = (row: Artwork) => {
    const newMap = new Map(selectedRowsMap);
    if (newMap.has(row.id)) {
      newMap.delete(row.id);
    } else {
      newMap.set(row.id, row);
    }
    setSelectedRowsMap(newMap);
  };

  const selectBulkRows = () => {
    const newMap = new Map(selectedRowsMap);
    for (let i = 0; i < Math.min(bulkCount, artworks.length); i++) {
      newMap.set(artworks[i].id, artworks[i]);
    }
    setSelectedRowsMap(newMap);
    op.current?.hide();
  };

  const headerCheckboxTemplate = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        onChange={(e) => {
          const newMap = new Map(selectedRowsMap);
          if (e.checked) {
            artworks.forEach((row) => newMap.set(row.id, row));
          } else {
            artworks.forEach((row) => newMap.delete(row.id));
          }
          setSelectedRowsMap(newMap);
        }}
        checked={artworks.every((row) => selectedRowsMap.has(row.id))}
      />
      <Button
        icon="pi pi-chevron-down"
        className="p-button-text p-button-sm"
        onClick={(e) => op.current?.toggle(e)}
      />
      <OverlayPanel ref={op} dismissable>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', width: '12rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Rows to select</label>
          <input
            type="number"
            value={bulkCount}
            onChange={(e) => setBulkCount(Number(e.target.value))}
            min={1}
            max={artworks.length}
            className="p-inputtext p-component"
            style={{ width: '100%' }}
          />
          <Button
            label="Submit"
            className="p-button-sm p-button-primary"
            style={{ width: '100%' }}
            onClick={selectBulkRows}
          />
        </div>
      </OverlayPanel>
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={artworks}
        paginator
        rows={rows}
        totalRecords={totalRecords}
        lazy
        loading={loading}
        onPage={onPageChange}
        first={page * rows}
        dataKey="id"
        key={selectedRowsMap.size} 
      >
        <Column
          header={headerCheckboxTemplate}
          body={(row) => (
            <Checkbox
              onChange={() => toggleRow(row)}
              checked={isRowSelected(row)}
            />
          )}
          style={{ width: '3rem' }}
        />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist Display" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>
    </div>
  );
};

export default DataTablePanel;
