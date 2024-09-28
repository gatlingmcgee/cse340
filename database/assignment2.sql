INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account 
SET account_type = 'Admin'
WHERE account_lastname = 'Stark';

DELETE from public.account
WHERE account_lastname = 'Stark';

UPDATE 	inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors')
WHERE inv_make = 'GM';

SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM public.inventory
	JOIN public.classification
    ON inventory.classification_id = classification.classification_id
    WHERE classification.classification_name = 'Sport';

UPDATE 	public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', 'images/vehicles/');
