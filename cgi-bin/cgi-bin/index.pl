#!"C:\xampp\perl\bin\perl.exe"

use strict;
use warnings;
use CGI;
use lib "./lib";
use Users;
use Data::Dump qw(dump);

my $q = CGI->new();
print $q->header;
print "Hello\n";
exit 0;
my $method = lc($ENV{'REQUEST_METHOD'});
my $path = $ENV{'REQUEST_URI'};
$path =~ s/\/cgi-bin\/index.pl\///g;
print "Path: '$path'\n";
#print dump($q->param('POSTDATA'));
print "Hi hello\n";
my $users = Users->new();
print dump($users->get_users());

