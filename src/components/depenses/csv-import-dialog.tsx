'use client';

import { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { mockDataStore, saveData } from '@/lib/mock-data';
import type { Expense } from '@/lib/types';
import { Upload, Check, ChevronsRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const EXPENSE_MODEL_FIELDS: (keyof Expense)[] = [
  'id',
  'description',
  'category',
  'amount',
  'date',
];

const MINIMUM_MAPPED_FIELDS: (keyof Expense)[] = ['description', 'category', 'amount', 'date'];

export function DepensesCsvImportDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(
    {}
  );
  const [editedData, setEditedData] = useState<Expense[]>([]);

  const { CSVReader } = useCSVReader();
  const { toast } = useToast();

  const defaultTrigger = (
    <Button variant="outline">
      <Upload />
      Importer
    </Button>
  );

  const handleUploadAccepted = (results: any) => {
    const data = results.data;
    if (data.length > 1) {
      const headerRow = data[0];
      const dataRows = data
        .slice(1)
        .filter((row: string[]) => row.some((cell) => cell.trim() !== ''));
      setHeaders(headerRow);
      setCsvData(dataRows);
      setStep(2);

      const initialMapping: Record<string, string> = {};
      headerRow.forEach((header: string) => {
        if (EXPENSE_MODEL_FIELDS.includes(header as keyof Expense)) {
          initialMapping[header] = header;
        }
      });
      setColumnMapping(initialMapping);
    } else {
      toast({
        title: 'Erreur',
        description: 'Le fichier CSV est vide ou ne contient pas de données.',
        variant: 'destructive',
      });
    }
  };

  const handleMappingChange = (csvHeader: string, expenseField: string) => {
    setColumnMapping((prev) => ({ ...prev, [csvHeader]: expenseField }));
  };

  const processAndPreview = () => {
    const mappedFields = Object.values(columnMapping);
    const missingFields = MINIMUM_MAPPED_FIELDS.filter(
      (field) => !mappedFields.includes(field)
    );

    if (missingFields.length > 0) {
      toast({
        title: 'Mappage de Colonne Requis',
        description: `Veuillez mapper au moins les champs suivants: ${missingFields.join(
          ', '
        )}`,
        variant: 'destructive',
      });
      return;
    }

    const partiallyMappedData: Partial<Expense>[] = csvData.map((row) => {
      const expense: Partial<Expense> = {};
      headers.forEach((header, index) => {
        const expenseField = columnMapping[header] as keyof Expense;
        if (expenseField && expenseField !== 'ignore') {
          let value: any = row[index] ?? '';
          if (expenseField === 'amount') {
             value = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
             if (isNaN(value)) value = 0;
          }
          if (expenseField === 'id') {
            value = String(value);
          }
          (expense as any)[expenseField] = value;
        }
      });
      return expense;
    });

    const importedIds = partiallyMappedData
      .map((p) => (p.id ? parseInt(p.id, 10) : 0))
      .filter((id) => !isNaN(id) && id > 0);

    const existingIds = mockDataStore.expenses
      .map((p) => parseInt(p.id, 10))
      .filter((id) => !isNaN(id) && id > 0);

    let maxId = Math.max(0, ...existingIds, ...importedIds);

    const finalMappedData: Expense[] = partiallyMappedData.map(
      (expense) => {
        if (!expense.id) {
          maxId++;
          expense.id = maxId.toString();
        }

        let date = new Date().toISOString();
        if (expense.date && !isNaN(parseISO(expense.date).getTime())) {
            date = parseISO(expense.date).toISOString();
        }

        return {
            id: expense.id,
            description: expense.description || 'Dépense sans description',
            category: expense.category || 'Non classé',
            amount: expense.amount ?? 0,
            date: date,
        };
      }
    );

    setEditedData(finalMappedData);
    setStep(3);
  };

  const handleCellChange = (
    rowIndex: number,
    fieldName: keyof Expense,
    value: string
  ) => {
    setEditedData((prev) => {
      const newData = [...prev];
      const newRow = { ...newData[rowIndex] };
       if (fieldName === 'amount') {
        (newRow as any)[fieldName] = parseFloat(value) || 0;
      } else {
        (newRow as any)[fieldName] = value;
      }
      newData[rowIndex] = newRow;
      return newData;
    });
  };

  const handleImport = () => {
    try {
      const hasValidData = editedData.every(
        (e) => e.description && e.description.trim() !== '' && e.amount > 0 && e.date && e.category
      );
      if (!hasValidData) {
        throw new Error(
          "Certaines lignes manquent de données obligatoires (description, category, amount, date) ou ont un montant invalide."
        );
      }

      const existingIdSet = new Set(mockDataStore.expenses.map((p) => p.id));
      const importIdSet = new Set<string>();
      for (const expense of editedData) {
        if (existingIdSet.has(expense.id)) {
          throw new Error(
            `L'ID "${expense.id}" pour la dépense "${expense.description}" existe déjà.`
          );
        }
        if (importIdSet.has(expense.id)) {
          throw new Error(
            `ID dupliqué trouvé dans le fichier d'importation : ${expense.id}.`
          );
        }
        importIdSet.add(expense.id);
      }

      mockDataStore.expenses.push(...editedData);
      editedData.forEach(expense => {
        if (!mockDataStore.settings.expenseCategories.includes(expense.category)) {
          mockDataStore.settings.expenseCategories.push(expense.category);
        }
      });

      saveData();
      window.dispatchEvent(new Event('datachanged'));

      toast({
        title: 'Succès !',
        description: `${editedData.length} dépense(s) ont été ajoutée(s) avec succès.`,
      });
      resetState();
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'importation: ${
          error instanceof Error ? error.message : 'Erreur inconnue'
        }`,
        variant: 'destructive',
      });
    }
  };

  const resetState = () => {
    setOpen(false);
    setStep(1);
    setCsvData([]);
    setHeaders([]);
    setColumnMapping({});
    setEditedData([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetState();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importer des dépenses depuis un fichier CSV</DialogTitle>
          <DialogDescription>
            Suivez les étapes pour importer vos données de dépenses.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <CSVReader onUploadAccepted={handleUploadAccepted}>
            {({ getRootProps, ProgressBar }: any) => (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-center p-16 flex-grow"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Faites glisser et déposez un fichier CSV ici, ou cliquez pour
                  sélectioncher un fichier
                </p>
                <ProgressBar
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                />
              </div>
            )}
          </CSVReader>
        )}

        {step === 2 && (
          <div className="flex-grow overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-2">
              Étape 2 : Mapper les colonnes
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Associez chaque colonne de votre fichier CSV à un champ de dépense. Tous les champs sont obligatoires.
            </p>
            <div className="overflow-auto flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead key={header}>
                        <p>{header}</p>
                        <Select
                          value={columnMapping[header] || ''}
                          onValueChange={(value) =>
                            handleMappingChange(header, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Mapper à..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ignore">Ignorer</SelectItem>
                            {EXPENSE_MODEL_FIELDS.map((field) => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(0, 3).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Précédent
              </Button>
              <Button onClick={processAndPreview}>
                Prévisualiser les données
                <ChevronsRight />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="flex-grow overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-2">
              Étape 3 : Prévisualiser et Modifier
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vérifiez les données importées. Vous pouvez modifier les cellules
              directement avant de finaliser l'importation.
            </p>
            <div className="overflow-auto flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    {EXPENSE_MODEL_FIELDS.map((field) => (
                      <TableHead key={field}>{field}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedData.map((expense, rowIndex) => (
                    <TableRow key={expense.id || rowIndex}>
                      {EXPENSE_MODEL_FIELDS.map((field) => (
                        <TableCell key={field}>
                          <Input
                            value={field === 'date' ? format(parseISO(expense.date), 'yyyy-MM-dd') : (expense as any)[field] ?? ''}
                            type={field === 'date' ? 'date' : 'text'}
                            onChange={(e) =>
                              handleCellChange(rowIndex, field, e.target.value)
                            }
                            className="h-8"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Précédent
              </Button>
              <Button onClick={handleImport}>
                Confirmer et Importer
                <Check />
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
